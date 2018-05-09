// @flow

import React from 'react';
import Block from './Block';

import '../styles/Level.css';

type Props = {
  index: number,
  txs: any,
  merkleProof: string
};


const Level = (props: Props) => {
  const { index, txs } = props;
  return (
    <div className={`tree-level level-${index}`}>
      {txs.map((tx: string, i) => <Block key={i} level={index} transaction={tx} merkleProof={props.merkleProof} />)}
    </div>
  );
};


export default Level;
