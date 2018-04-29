import React from 'react';
import Block from './Block';

import '../styles/Level.css';

const Level = props => {
  const { index, txs } = props;
  return (
    <div className={`tree-level level-${index}`}>
      {txs.map((tx, i) => <Block key={i} level={index} transaction={tx} merkleProof={props.merkleProof} />)}
    </div>
  );
};

export default Level;
