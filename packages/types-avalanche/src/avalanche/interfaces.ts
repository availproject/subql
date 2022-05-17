// Copyright 2020-2022 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {BlockWrapper} from '../interfaces';

export interface AvalancheCallFilter {
  from?: string;
  to?: string;
  function?: string;
}

export interface AvalancheLogFilter {
  topics?: Array<string | null | undefined>;
  address?: string;
}

export interface AvalancheResult extends ReadonlyArray<any> {
  readonly [key: string]: any;
}

export type AvalancheBlock = {
  difficulty: BigInt;
  extraData: string;
  gasLimit: BigInt;
  gasUsed: BigInt;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: BigInt;
  stateRoot: string;
  timestamp: BigInt;
  totalDifficulty: BigInt;
  transactions: AvalancheTransaction[];
  transactionsRoot: string;
  uncles: string[];
};

export type AvalancheTransaction<T extends AvalancheResult = AvalancheResult> = {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  v: string;
  r: string;
  s: string;
  args?: T;
};

export type AvalancheLog<T extends AvalancheResult = AvalancheResult> = {
  logIndex: string;
  blockNumber: string;
  blockHash: string;
  transactionHash: string;
  transactionIndex: string;
  address: string;
  data: string;
  topics: string[];
  args?: T;
};

export interface AvalancheBlockWrapper
  extends BlockWrapper<AvalancheBlock, AvalancheTransaction, AvalancheLog, AvalancheCallFilter, AvalancheLogFilter> {
  getTransactions: (filters?: string[]) => Record<string, any>;
}
