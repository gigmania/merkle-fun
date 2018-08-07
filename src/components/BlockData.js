// @flow

import React from 'react';
import '../styles/App.css';
import '../styles/BlockData.css';

type Props = {
  txs: (?string)[],
  blockInfo: {
    block_index: number,
    height: number,
    bits: number,
    hash: string
  }
};

const BlockData = (props: Props) => {
  const { blockInfo } = props;
  return (
    <div className="block-details-box">
      <div className="block-details">
        <span className="block-text-title"> Block Index:</span>
        <span className="block-text"> {blockInfo.block_index}</span>
      </div>
      <div className="block-details">
        <span className="block-text-title">Height:</span>
        <span className="block-text">{blockInfo.height}</span>
      </div>
      <div className="block-details">
        <span className="block-text-title">Bits:</span>
        <span className="block-text">{blockInfo.bits}</span>
      </div>
      <div className="block-details">
        <span className="block-text-title">Hash:</span>
        <span className="block-text">{blockInfo.hash}</span>
      </div>
    </div>
  );
};

export default BlockData;
