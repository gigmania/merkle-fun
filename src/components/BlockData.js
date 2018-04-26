import React from 'react';
import '../styles/App.css';

const BlockData = props => {
  const { blockInfo } = props;
  return (
    <div className="block-details-box">
      <div className="block-details">Block Index: {blockInfo.block_index}</div>
      <div className="block-details">Fee: {blockInfo.fee} satoshi</div>
      <div className="block-details">Size: {blockInfo.size} </div>
      <div className="block-details">Bits: {blockInfo.bits} </div>
      <div className="block-details">Height: {blockInfo.height} </div>
    </div>
  );
};

export default BlockData;
