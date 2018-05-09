import React from 'react';

import '../styles/App.css';


const MerkleRoot = (props) => {
  const { root } = props;
  return (
    <div className="merkle-root">
      <span className="block-text-title"> Merkle Root: </span>
      <span className="merkle-root-text">{root}</span>
    </div>
  )
}

export default MerkleRoot;
