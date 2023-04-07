import React, {
  useCallback,
  useState,
} from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Radio,
} from 'antd';
import axios from 'axios';
import {
  NftTokenId,
  FtTokenId,
  tokenIdOptions,
} from '@/constants/token-id';
import { apiPromise } from '@/utils/polkadot-api';

export interface ClaimFormProps {
  publicKey: `0x${string}`
}

const { Item, useForm, useWatch } = Form;
const { Group } = Radio;

interface ValuesType {
  tokenId: string
  itemId?: string
}

const defaultValues: ValuesType = {
  tokenId: FtTokenId,
};

interface ClaimResponse {
  code: 0 | -1
  message: string
}

export default function ClaimForm({ publicKey }: ClaimFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const onFinish = useCallback(async ({ tokenId, itemId }: ValuesType) => {
    setSubmitting(true);
    if (tokenId === NftTokenId) {
      if (!itemId) {
        message.error('请输入 Item ID');
        setSubmitting(false);
        return;
      }
      const api = await apiPromise;
      const collectionId = (await api.query.uniques.tokenId2CollectionId(NftTokenId)).toJSON();
      const item = (await api.query.uniques.asset(collectionId, itemId)).toJSON();
      if (item) {
        message.error('Item 不能领取，请重新输入');
        setSubmitting(false);
        return;
      }
    }
    const { data } = await axios.post<ClaimResponse>('http://3.122.90.113:7799/get_token', null, {
      params: {
        publicKey,
        tokenId,
        pallet: tokenId === NftTokenId ? 'uniques' : 'assets',
        itemId,
      },
    });
    if (data.code === 0) {
      message.success('领取测试币成功');
    } else {
      message.error(data.message, 10);
    }
    setSubmitting(false);
  }, [publicKey]);

  const [form] = useForm<ValuesType>();
  const tokenId = useWatch('tokenId', form);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ offset: 4, span: 4 }}
      wrapperCol={{ span: 8 }}
      initialValues={defaultValues}
    >
      <Item name="tokenId" label="Token ID">
        <Group options={tokenIdOptions} />
      </Item>
      <Item name="itemId" label="Item ID">
        <Input disabled={tokenId === FtTokenId} />
      </Item>
      <Item wrapperCol={{ offset: 8 }}>
        <Button loading={submitting} htmlType="submit" type="primary">{submitting ? 'Processing' : 'Submit'}</Button>
      </Item>
    </Form>
  );
}
