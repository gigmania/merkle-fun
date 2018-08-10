import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLatestHash } from '../utils/actionCreators';

import Spinner from './Spinner';

import '../styles/ProofButtons.css';

class ProofButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeLoading: false
    };
  }
  proveMerkleRoot(root, txs) {
    this.props.fetchLatestHash(root, txs);
  }
  render() {
    console.log('PROOF BUTTONS PROPS --->> ', this.props);
    const { merkleRootProof, root, txHashes, txsFetchStatus, txData } = this.props;
    let proofBtns = <div />;
    if (merkleRootProof.length < 1) {
      if (root && root.length > 0) {
        if (txsFetchStatus === 'INIT') {
          proofBtns = (
            <div className="prove-merkle-root">
              <button
                className="prove-root btn-blue"
                type="button"
                onClick={() => this.proveMerkleRoot(root, txHashes)}
              >
                <span> PROVE MERKLE ROOT </span>
              </button>
            </div>
          );
        }
        if (txsFetchStatus === 'FETCHING') {
          proofBtns = (
            <div className="spinner-box">
              <div className="spinner-text">
                BUILDING MERKLE TREE FROM <span className="txs-length"> {txHashes.length} </span>TXS HASHES
              </div>
              <Spinner />
            </div>
          );
        }
      }
    } else {
      if (txsFetchStatus === 'DONE' && txData.length < 1) {
        proofBtns = (
          <div className="prove-merkle-root">
            <button className="select-random-tx btn" type="button" onClick={() => this.pickRandomTx()}>
              <span> SELECT RANDOM TX </span>
            </button>
          </div>
        );
      }
    }
    return proofBtns;
  }
}

const mapStateToProps = state => ({
  merkleRootProof: state.merkleRootProof,
  merkleTree: state.merkleTree,
  txsFetchStatus: state.txsFetchStatus,
  txData: state.txData
});
const mapDispatchToProps = dispatch => ({
  fetchLatestHash(root, txs) {
    dispatch(getLatestHash(root, txs));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProofButtons);
