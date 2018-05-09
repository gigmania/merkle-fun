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
  const { index, txs, merkleProof } = props;
  return (
    <div className={`tree-level level-${index}`}>
      {txs.map((tx, i) => <Block key={i} level={index} transaction={tx} merkleProof={merkleProof} />)}
    </div>
  );
};


export default Level;
