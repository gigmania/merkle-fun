// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLatestHash, txData, fetchLatestBlock } from '../utils/actionCreators';

import Level from './Level';
import BlockData from './BlockData';
import TxData from './TxData';
import Spinner from './Spinner';

import '../styles/App.css';
import '../styles/Tree.css';

type State = {
  treeLoading: boolean,
  satoshiSent: string,
  txsCount: string,
  price: string
};

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
};

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
  // proveMerkleRoot(root, txs) {
  //   this.props.fetchLatestHash(root, txs);
  // }

  getBTCSent() {
    return fetch('https://blockchain.info/q/24hrbtcsent?cors=true').then(result => {
      return result.text();
    });
  }

  getTransCount() {
    return fetch('https://blockchain.info/q/24hrtransactioncount?cors=true').then(result => {
      return result.text();
    });
  }

  getPrice() {
    return fetch('https://blockchain.info/q/24hrprice?cors=true').then(result => {
      return result.text();
    });
  }

  getSummaryData() {
    let satoshi;
    let txsCount;
    let that = this;
    this.getBTCSent()
      .then(result => {
        satoshi = result;
      })
      .then(this.getTransCount)
      .then(count => {
        txsCount = count;
      })
      .then(this.getPrice)
      .then(price => {
        that.setState({
          satoshiSent: satoshi,
          txsCount: txsCount,
          price: price
        });
      });
  }

  getLastestBlock() {
    return fetch('https://blockchain.info/latestblock?cors=true').then(result => {
      return result.text();
    });
  }
  getBlockData(hash) {
    return fetch(`https://blockchain.info/rawblock/${hash}?cors=true`).then(result => {
      return result.text();
    });
  }

  render() {
    console.log(this.props);
    const { merkleTree, rootTxs, merkleRootProof, txData, blockInfo, txsFetchStatus } = this.props;
    const root = blockInfo.mrkl_root;
    const txs = rootTxs.txs;
    let blockInfoBox;
    let mrklRootElem;
    let merkleProofBox;
    let proofBtns;
    let txElem;
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
        if (txsFetchStatus === 'FETCHING') {
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
        <div className="merkle-root-box">
          <div className="root-proof-box">
            {merkleProofBox}
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
  blockInfo: state.blockInfo,
  merkleRootProof: state.merkleRootProof,
  merkleTree: state.merkleTree,
  rootTxs: state.rootTxs,
  txData: state.txData,
  txsFetchStatus: state.txsFetchStatus
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
