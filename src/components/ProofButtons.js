import React, { Component } from 'react';

import '../styles/App.css';

class ProofButtons extends Component {
  render() {
    const { blockInfo, merkleRootProof } = this.props;
    let proofBtns = <div />;
    if (merkleRootProof.length < 1) {
      if (blockInfo.mrkl_root && blockInfo.mrkl_root.length > 1) {
        proofBtns = (
          <div className="prove-merkle-root">
            <button
              className="prove-root btn-blue"
              type="button"
              onClick={() => this.proveMerkleRoot(root, blockInfo.tx)}
            >
              <span> PROVE MERKLE ROOT </span>
            </button>
          </div>
        );
      }
    }
    return proofBtns;
  }
}

export default ProofButtons;
