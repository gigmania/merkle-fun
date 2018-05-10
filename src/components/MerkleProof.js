import React from 'react';

import '../styles/App.css';

const MerkleProof = props => {
  const { merkleRootProof, root } = props;
  let merkleProofBox;
  if (merkleRootProof.length < 1) {
    merkleProofBox = <div className="merkle-root-proof" />;
  } else {
    if (merkleRootProof === root) {
      merkleProofBox = (
        <div className="merkle-root-proof">
          <span className="block-text-title"> merkle root proof: </span>
          <span className="proof-true"> {merkleRootProof} </span>
        </div>
      );
    } else {
      merkleProofBox = (
        <div className="merkle-root-proof">
          <span className="block-text-title"> merkle root proof: </span>
          <span className="proof-false">{merkleRootProof} </span>
        </div>
      );
    }
  }
  return merkleProofBox;
};

export default MerkleProof;
