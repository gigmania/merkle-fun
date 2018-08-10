import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLatestHash, txData, findProofPath } from '../utils/actionCreators';

import Spinner from './Spinner';

import '../styles/ProofButtons.css';

class ProofButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeLoading: false
    };
    this.makeProof = this.makeProof.bind(this);
  }
  makeProof(txs, txData) {
    this.props.getProofPath(txs, txData);
  }
  pickRandomTx() {
    const txHash = this.randomize(this.props.rootTxs.txs);
    this.props.showTxData(txHash);
  }
  proveMerkleRoot(root, txs) {
    this.props.fetchLatestHash(root, txs);
  }
  randomize(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  render() {
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
      if (txsFetchStatus === 'DONE') {
        if (txData.length < 1) {
          proofBtns = (
            <div className="prove-merkle-root">
              <button className="select-random-tx btn" type="button" onClick={() => this.pickRandomTx()}>
                <span> SELECT RANDOM TX </span>
              </button>
            </div>
          );
        } else {
          proofBtns = (
            <div className="tx-root-proof">
              <button
                className="tx-proof-btn btn-blue"
                type="button"
                onClick={() => this.makeProof(this.props.rootTxs.txs, this.props.txData)}
              >
                <span> PROVE TX IN BLOCK </span>
              </button>
            </div>
          );
        }
      }
    }
    return proofBtns;
  }
}

const mapStateToProps = state => ({
  merkleRootProof: state.merkleRootProof,
  merkleTree: state.merkleTree,
  rootTxs: state.rootTxs,
  txData: state.txData,
  txsFetchStatus: state.txsFetchStatus
});
const mapDispatchToProps = dispatch => ({
  fetchLatestHash(root, txs) {
    dispatch(getLatestHash(root, txs));
  },
  showTxData(tx) {
    dispatch(txData(tx));
  },
  getProofPath(txs, tx) {
    dispatch(findProofPath(txs, tx));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProofButtons);
