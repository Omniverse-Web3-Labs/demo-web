import React, {
  useCallback,
  useState,
} from 'react';
import {
  Button,
  Form,
  Input,
  Select,
} from 'antd';
import {
  bscTestnet,
  chainInfoMap,
  chains,
} from '@/constants/chains';
import {
  utils,
  BigNumber,
} from 'ethers';
import { ftAbi } from '@/constants/abi';
import { Operator } from '@/constants/operator';
import { Buffer } from 'buffer/';
import BN from 'bn.js';
import {
  readContract,
  writeContract,
  prepareWriteContract,
} from 'wagmi/actions';
import { personalSign } from '@/utils/crypto';

export interface TransferFormProps {
  publicKey: `0x${string}`
  address: `0x${string}`
}

const { Item, useForm } = Form;

const chainIdOptions = chains.map(({ id, name }) => ({
  value: id.toString(),
  label: name,
}));

interface ValuesType {
  chainId: string
  amount?: string
  to?: `0x${string}`
}

const defaultValues: ValuesType = {
  chainId: bscTestnet.id.toString(),
};

const getHashData = (
  {
    nonce,
    chainId,
    initiateSC,
    from,
  }: { nonce: BigNumber, chainId: number, initiateSC: `0x${string}`, from: `0x${string}` },
  operator: Operator,
  to: `0x${string}`,
  amount: BigNumber,
): string => Buffer.concat([
  Buffer.from(new BN(nonce.toString()).toString('hex').padStart(32, '0'), 'hex'),
  Buffer.from(new BN(chainId).toString('hex').padStart(8, '0'), 'hex'),
  Buffer.from(initiateSC.slice(2), 'hex'), Buffer.from(from.slice(2), 'hex'),
  Buffer.from(new BN(operator).toString('hex').padStart(2, '0'), 'hex'),
  Buffer.from(to.slice(2), 'hex'),
  Buffer.from(new BN(amount.toString()).toString('hex').padStart(32, '0'), 'hex'),
]).toString('hex');

export default function TransferForm({ publicKey, address }: TransferFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [form] = useForm<ValuesType>();
  const onFinish = useCallback(async ({ chainId, amount, to }: ValuesType) => {
    if (!publicKey) {
      return;
    }
    setSubmitting(true);
    const nonce = await readContract({
      address: chainInfoMap[chainId].ftAddress,
      functionName: 'getTransactionCount',
      chainId: Number(chainId),
      abi: ftAbi,
      args: [publicKey],
    });

    const amountBigNumber = utils.parseUnits(amount || '0', 12);
    const txData = {
      nonce,
      chainId: chainInfoMap[chainId].omniverseChainId,
      from: publicKey!,
      initiateSC: chainInfoMap[chainId].ftAddress,
      payload: utils.defaultAbiCoder.encode(
        ['uint8', 'bytes', 'uint256'],
        [Operator.Transfer, to, amountBigNumber],
      ) as `0x${string}`,
    };
    console.log('txData', txData);
    const message = getHashData(txData, Operator.Transfer, to!, amountBigNumber);
    console.log('message', message);
    const signature = await personalSign(message, address);
    console.log('signature', signature);
    const config = await prepareWriteContract({
      address: chainInfoMap[chainId].ftAddress,
      abi: ftAbi,
      functionName: 'sendOmniverseTransaction',
      chainId: Number(chainId),
      args: [{
        ...txData,
        signature,
      }],
    });
    const result = await writeContract(config);
    console.log(result);
    setSubmitting(false);
  }, [publicKey, address]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ offset: 4, span: 4 }}
      wrapperCol={{ span: 8 }}
      initialValues={defaultValues}
    >
      <Item name="chainId" label="Chain">
        <Select options={chainIdOptions} />
      </Item>
      <Item name="to" label="To" rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item name="amount" label="Amount" rules={[{ required: true }]}>
        <Input />
      </Item>
      <Item wrapperCol={{ offset: 8 }}>
        <Button loading={submitting} htmlType="submit" type="primary">{submitting ? 'Processing' : 'Submit'}</Button>
      </Item>
    </Form>
  );
}
