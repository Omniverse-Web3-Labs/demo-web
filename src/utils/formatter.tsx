import React, { ReactNode } from 'react';
import type {
  useBalance,
} from 'wagmi';
import {
  format,
  parseISO,
  isValid,
} from 'date-fns/fp';
import {
  trimCharsEnd,
  flow,
  isFinite,
  isNaN,
} from 'lodash/fp';

export const datetime = ({
  formatter = 'yyyy-MM-dd HH:mm:ss',
  defaultDisplay = '--',
  parse = parseISO,
} = {}) => (value: number | Date | string): string => {
  try {
    const dateValue = typeof value === 'string' ? parse(value) : value;
    if (isValid(dateValue)) {
      return format(formatter)(dateValue);
    }
    return defaultDisplay;
  } catch (e) {
    console.warn(e);
    return defaultDisplay;
  }
};

export const date = ({
  formatter = 'yyyy-MM-dd',
  defaultDisplay = '--',
  parse = parseISO,
} = {}) => datetime({ formatter, defaultDisplay, parse });

type UseBalance = ReturnType<typeof useBalance>;

export const getFixedCoin = (value: number | string) => {
  const stringValue = typeof value === 'number' ? value.toString() : value;
  const matches = stringValue.match(/^-?\d+(?:\.\d{0,5})?/);
  if (matches) {
    return matches[0];
  }
  return stringValue;
};

export const addComma = (value?: string) => {
  if (value) {
    const [integer, digit] = value.split('.');
    const finalInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalDigit = trimCharsEnd('0')(digit);
    if (finalDigit) {
      return `${finalInteger}.${finalDigit}`;
    }
    return finalInteger;
  }
  return value;
};

export const parseCoin = (value?: string) => value?.replace(/\$\s?|(,*)/g, '') || '';

export const formatCoin = () => (value?: string) => {
  if (value) {
    const [integer, digit] = value.split('.');
    const finalInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (digit) {
      return `${finalInteger}.${digit}`;
    }
    return finalInteger;
  }

  return '';
};

export const getCoinDisplay = (number: number | string | undefined | null) => {
  if (typeof number === 'number') {
    if (number === 0) {
      return '0.00000';
    }
    return flow(
      getFixedCoin,
      formatCoin(),
    )(number);
  }
  if (!number) {
    return '--';
  }
  if (number === '0') {
    return '0.00000';
  }
  return flow(
    getFixedCoin,
    formatCoin(),
  )(number);
};
export const getBalanceDisplay = ({
  isSuccess,
  data,
}: {
  isSuccess: UseBalance['isSuccess'],
  data: UseBalance['data'],
}) => {
  if (isSuccess && data?.formatted) {
    return getCoinDisplay(data.formatted);
  }
  return '--';
};

export const percentage = ({ digit = 2, symbol = '%', defaultDisplay = '--' } = {}) => (value: number): string => {
  if (isFinite(value)) {
    const digits = 10 ** digit;
    const result = Math.round(Number(value) * digits * 100) / digits;
    return isNaN(result) ? defaultDisplay : `${result.toFixed(digit)}${symbol}`;
  }
  return defaultDisplay;
};

export const ellipsis = ({
  startLength = 4,
  endLength = 4,
  placeholder = '...',
  defaultDisplay = '--',
} = {}) => (value?: string): string => {
  if (!value) {
    return defaultDisplay;
  }
  if (value.length <= startLength + endLength) {
    return value;
  }
  return `${value.slice(0, startLength)}${placeholder}${value.slice(value.length - endLength, value.length)}`;
};

export const spanChunkValues = {
  span: (chunks: ReactNode[]) => <span>{chunks}</span>,
};
