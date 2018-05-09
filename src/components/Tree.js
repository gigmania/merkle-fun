// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLatestHash, txData, fetchLatestBlock } from '../utils/actionCreators';

import Level from './Level';
import BlockData from './BlockData';
import TxData from './TxData';
import Spinner from './Spinner';
import MerkleRoot from './MerkleRoot';
import MerkleProof from './MerkleProof';


import '../styles/App.css';

type State = {
  treeLoading: boolean,
  satoshiSent: string,
  txsCount: string,
  price: string
}

type Props = {
  fetchLatestHash: Function,
  showTxData: Function,
  getLatestBlock: Function,
  txData: string,
  rootTxs: {
    root: string,
    txs: (?string)[]
  },
  merkleTree: (?string)[][],
  merkleRootProof: string,
  blockInfo: {
    block_index: number,
    height: number,
    bits: number,
    hash: string,
    tx: any,
    mrkl_root: string
  }
}

class Tree extends Component<Props, State> {
  state = {
    treeLoading: false,
    satoshiSent: '',
    txsCount: '',
    price: ''
  };

  componentWillMount() {
    this.props.getLatestBlock();
  }

  proveMerkleRoot(root, txs) {
    this.setState((state, props) => {
      return {
        treeLoading: !state.treeLoading
      };
    });
    this.props.fetchLatestHash(root, txs);
  }

  pickRandomTx() {
    const txHash = this.randomize(this.props.rootTxs.txs);
    this.props.showTxData(txHash);
  }

  randomize(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  render() {
    const { merkleTree, rootTxs, merkleRootProof, txData, blockInfo } = this.props;
    const root = blockInfo.mrkl_root;
    const txs = rootTxs.txs;
    let blockInfoBox;
    let mrklRootElem;
    let merkleProofBox;
    let proofBtns;
    let txElem;
    if (root != null) {
      mrklRootElem = <MerkleRoot root={root} />;
    }
    if (merkleRootProof.length < 1) {
      merkleProofBox = <div className="merkle-root-proof" />;
      if (root && root.length > 0) {
        if (this.state.treeLoading === false) {
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
        if (this.state.treeLoading === true) {
          proofBtns = (
            <div className="spinner-box">
              <div className="spinner-text">
                BUILDING MERKLE TREE FROM <span className="txs-length"> {blockInfo.tx.length} </span>TXS HASHES
              </div>
              <Spinner />
            </div>
          );
        }
      }
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
      if (txData.length < 1) {
        proofBtns = (
          <div className="prove-merkle-root">
            <button className="select-random-tx btn" type="button" onClick={() => this.pickRandomTx()}>
              <span> SELECT RANDOM TX </span>
            </button>
          </div>
        );
      }
      if (txData.length > 0) {
        txElem = (
          <div className="data-box">
            <TxData txData={txData} txs={txs} root={root} />
          </div>
        );
      }
    }
    return (
      <div className="tree-box">
        <BlockData blockInfo={blockInfo} txs={txs} />
        <div className="merkle-root-box">
          {mrklRootElem}
          <div className="root-proof-box">
            <MerkleProof merkleRootProof = {merkleRootProof} />
            {proofBtns}
          </div>
        </div>
        {txElem}
        {merkleTree.map((trxs, index) => <Level key={index} index={index} txs={trxs} merkleProof={merkleRootProof} />)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  txData: state.txData,
  rootTxs: state.rootTxs,
  merkleTree: state.merkleTree,
  merkleRootProof: state.merkleRootProof,
  blockInfo: state.blockInfo
});

const mapDispatchToProps = (dispatch: Function) => ({
  fetchLatestHash(root, txs) {
    dispatch(getLatestHash(root, txs));
  },
  showTxData(tx) {
    dispatch(txData(tx));
  },
  getLatestBlock() {
    dispatch(fetchLatestBlock());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
