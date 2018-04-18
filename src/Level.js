import React from 'react';
import Block from './Block';
import './App.css';

const Level = props => {
  const { index, txs } = props;
  return (
    <div className={`tree-level level-${index}`}>
      {txs.map((tx, i) => <Block key={i} level={index} transaction={tx} />)}
    </div>
  );
};

export default Level;
