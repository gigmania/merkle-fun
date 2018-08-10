import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchLatestBlock } from '../utils/actionCreators';

import BlockData from './BlockData';
import ProofButtons from './ProofButtons';
import Spinner from './Spinner';

import '../styles/App.css';
import '../styles/Torso.css';

class Torso extends Component {
  componentWillMount() {
    this.props.getLatestBlock();
  }
  render() {
    const { blockInfo, merkleRootProof } = this.props;
    const root = blockInfo.mrkl_root;
    console.log(blockInfo);
    let blockInfoBox;
    let mrklRootElem;
    let merkleProofBox = <div className="merkle-root-proof" />;
    if (root != null) {
      blockInfoBox = (
        <div className="block-info-box">
          <BlockData blockInfo={blockInfo} />
        </div>
      );
      mrklRootElem = (
        <div className="merkle-root">
          <span className="block-text-title block-text-title--details"> Merkle Root: </span>
          <span className="merkle-root-text text--hash">{root}</span>
        </div>
      );
      if (merkleRootProof.length > 1) {
        if (merkleRootProof === root) {
          merkleProofBox = (
            <div className="merkle-root-proof">
              <span className="block-text-title block-text-title--details"> Merkle Root Proof: </span>
              <span className="proof-true proof-solution text--hash"> {merkleRootProof} </span>
            </div>
          );
        } else {
          merkleProofBox = (
            <div className="merkle-root-proof">
              <span className="block-text-title block-text-title--details"> Merkle Root Proof: </span>
              <span className="proof-false proof-solution text--hash">{merkleRootProof} </span>
            </div>
          );
        }
      }
    } else {
      blockInfoBox = (
        <div className="spinner-box top-50">
          <div className="spinner-text">FETCHING LATEST BITCOIN BLOCK</div>
          <Spinner />
        </div>
      );
    }
    return (
      <div className="torso-box">
        {blockInfoBox}
        <div className="merkle-root-box">
          {mrklRootElem}
          <div className="root-proof-box">{merkleProofBox}</div>
          <ProofButtons root={root} txHashes={blockInfo.tx} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ blockInfo: state.blockInfo, merkleRootProof: state.merkleRootProof });
const mapDispatchToProps = dispatch => ({
  getLatestBlock() {
    dispatch(fetchLatestBlock());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Torso);
