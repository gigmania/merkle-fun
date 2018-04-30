import React, { Component } from 'react';
import sha256 from 'js-sha256';
import { connect } from 'react-redux';
import { getLatestHash, txData, fetchLatestBlock } from '../utils/actionCreators';

import Level from './Level';
import NetworkData from './NetworkData';
import BlockData from './BlockData';
import TxData from './TxData';

import '../styles/App.css';

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      root: '',
      merkleTree: [],
      uiTree: [],
      blockInfo: {},
      satoshiSent: '',
      txsCount: '',
      price: '',
      txs: []
    };
  }
  componentWillMount() {
    //this.props.fetchLatestHash();
    this.props.getLatestBlock();
  }
  componentDidMount() {
    //this.getSummaryData();
  }

  proveMerkleRoot() {
    this.props.fetchLatestHash();
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
    const { price, satoshiSent, txsCount } = this.state;
    const { merkleTree, rootTxs, merkleRootProof, txData, blockInfo } = this.props;
    const root = blockInfo.mrkl_root;
    const txs = rootTxs.txs;
    let merkleProofBox;
    let proofBtns;
    let txElem;
    let numPrice = Number(price);
    let btcSent = satoshiSent * 0.00000001;
    let sendValue = numPrice * btcSent;
    if (merkleRootProof.length < 1) {
      merkleProofBox = <div className="merkle-root-proof" />;
      if (root && root.length > 0) {
        proofBtns = (
          <div className="prove-merkle-root">
            <button className="prove-root btn-blue" type="button" onClick={() => this.proveMerkleRoot()}>
              <span> PROVE MERKLE ROOT </span>
            </button>
          </div>
        );
      }
    } else {
      if (merkleRootProof === root) {
        merkleProofBox = <div className="merkle-root-proof proof-true"> merkle root proof: {merkleRootProof} </div>;
      } else {
        merkleProofBox = <div className="merkle-root-proof proof-false"> merkle root proof: {merkleRootProof} </div>;
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
            <TxData txData={txData} txs={txs} merkleRootProof={merkleRootProof} />
          </div>
        );
      }
    }
    return (
      <div className="tree-box">
        <div className="data-box">
          <BlockData blockInfo={blockInfo} txs={txs} />
        </div>
        <div className="merkle-root-box">
          <div className="merkle-root">
            <span className="block-text-title"> Merkle Root: </span>
            <span className="merkle-root-text">{root}</span>
          </div>
          <div className="root-proof-box">
            {merkleProofBox}
            {proofBtns}
          </div>
        </div>
        {txElem}
        {merkleTree.map((txs, index) => <Level key={index} index={index} txs={txs} merkleProof={this.merkleProof} />)}
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
  fetchLatestHash() {
    dispatch(getLatestHash());
  },
  showTxData(tx) {
    dispatch(txData(tx));
  },
  getLatestBlock() {
    dispatch(fetchLatestBlock());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
