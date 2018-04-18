import React from 'react';
import './App.css';

const Block = props => {
  const { level } = props;
  return <div className={`tree-block level-${level}-block`} />;
};

export default Block;
