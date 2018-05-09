import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getLatestHash, txData, fetchLatestBlock } from '../utils/actionCreators';

import Level from './Level';
import BlockData from './BlockData';
import TxData from './TxData';
import Spinner from './Spinner';

import '../styles/App.css';

class Tree extends Component {
  state = {
    treeLoading: false,
    satoshiSent: '',
    txsCount: '',
    price: ''
  };

  componentWillMount() {
    //this.props.fetchLatestHash();
    this.props.getLatestBlock();
  }
  componentDidMount() {
    //this.getSummaryData();
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

  randomize(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  render() {
    // const { price, satoshiSent, txsCount } = this.state;
    const { merkleTree, rootTxs, merkleRootProof, txData, blockInfo } = this.props;
    const root = blockInfo.mrkl_root;
    const txs = rootTxs.txs;
    let blockInfoBox;
    let mrklRootElem;
    let merkleProofBox;
    let proofBtns;
    let txElem;
    // let numPrice = Number(price);
    // let btcSent = satoshiSent * 0.00000001;
    // let sendValue = numPrice * btcSent;
    if (root != null) {
      blockInfoBox = (
        <div className="data-box">
          <BlockData blockInfo={blockInfo} txs={txs} />
        </div>
      );
      mrklRootElem = (
        <div className="merkle-root">
          <span className="block-text-title"> Merkle Root: </span>
          <span className="merkle-root-text">{root}</span>
        </div>
      );
    } else {
      blockInfoBox = (
        <div className="spinner-box top-50">
          <div className="spinner-text">FETCHING LATEST BITCOIN BLOCK</div>
          <Spinner />
        </div>
      );
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
        {blockInfoBox}
        <div className="merkle-root-box">
          {mrklRootElem}
          <div className="root-proof-box">
            {merkleProofBox}
            {proofBtns}
          </div>
        </div>
        {txElem}
        {merkleTree.map((trxs, index) => <Level key={index} index={index} txs={trxs} merkleProof={this.merkleProof} />)}
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
