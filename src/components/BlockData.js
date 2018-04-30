import React from 'react';
import '../styles/App.css';

const BlockData = props => {
  const { blockInfo } = props;
  return (
    <div className="block-details-box">
      <div className="block-details">
        <span className="block-text-title"> Block Index:</span>
        <span className="block-text"> {blockInfo.block_index}</span>
      </div>
      <div className="block-details">
        <span className="block-text-title">Height:</span> <span className="block-text">{blockInfo.height}</span>
      </div>
      <div className="block-details">
        <span className="block-text-title">Bits:</span> <span className="block-text">{blockInfo.bits}</span>
      </div>
      <div className="block-details">
        <span className="block-text-title">Hash:</span> <span className="block-text">{blockInfo.hash}</span>
      </div>
    </div>
  );
};

export default BlockData;
