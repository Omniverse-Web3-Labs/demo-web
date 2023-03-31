import React, {
  useCallback,
} from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Radio,
} from 'antd';
import axios from 'axios';
import { NftTokenId, FtTokenId } from '@/constants/chains';
import { apiPromise } from '@/utils/polkadot-api';

export interface ClaimFormProps {
  publicKey: `0x${string}`
}

const { Item, useForm, useWatch } = Form;
const { Group } = Radio;

const tokenIdOptions = [{
  label: FtTokenId,
  value: FtTokenId,
}, {
  label: NftTokenId,
  value: NftTokenId,
}];

interface ValuesType {
  tokenId: string
  itemId?: string
}

const defaultValues: ValuesType = {
  tokenId: FtTokenId,
};

export default function ClaimForm({ publicKey }: ClaimFormProps) {
  const onFinish = useCallback(async ({ tokenId, itemId }: ValuesType) => {
    if (tokenId === NftTokenId) {
      const api = await apiPromise;
      const collectionId = (await api.query.uniques.tokenId2CollectionId(NftTokenId)).toJSON();
      const item = (await api.query.uniques.asset(collectionId, itemId)).toJSON();
      if (item) {
        message.error('Item 不能领取，请重新输入');
        return;
      }
    }
    const result = await axios.get('http://35.158.224.2:7788/get_token', {
      params: {
        publicKey,
        tokenId,
        pallet: tokenId === NftTokenId ? 'uniques' : 'assets',
        itemId,
      },
    });
    console.log(result);
    message.success('领取测试币成功');
  }, [publicKey]);

  const [form] = useForm<ValuesType>();
  const tokenId = useWatch('tokenId', form);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ offset: 4 }}
      wrapperCol={{ span: 8 }}
      initialValues={defaultValues}
    >
      <Item name="tokenId" label="Token ID">
        <Group options={tokenIdOptions} />
      </Item>
      <Item name="itemId" label="Item ID">
        <Input disabled={tokenId === FtTokenId} />
      </Item>
      <Item wrapperCol={{ offset: 4 }}>
        <Button htmlType="submit" type="primary">Submit</Button>
      </Item>
    </Form>
  );
}
