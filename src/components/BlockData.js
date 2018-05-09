// @flow

import React from 'react';
import Spinner from './Spinner';

import '../styles/App.css';

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
  let blockBox;
  if (blockInfo.mrkl_root != null) {
    blockBox = (
      <div className="data-box">
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
      </div>
    )
  } else {
    blockBox = (
      <div className="spinner-box top-50">
        <div className="spinner-text">FETCHING LATEST BITCOIN BLOCK</div>
        <Spinner />
      </div>
    )
  }
  return blockBox
};

export default BlockData;
