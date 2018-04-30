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
    let that = this;
    //this.getSummaryData();
    // this.getLastestBlock().then(result => {
    //   let parseObj = JSON.parse(result);
    //   //console.log(parseObj);
    //   that.getBlockData(parseObj.hash).then(deets => {
    //     let blockInfo = JSON.parse(deets);
    //     that.setState({
    //       blockInfo: blockInfo
    //     });
    //   });
    // });
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
    console.log(this.props);
    let proofElem;
    let numPrice = Number(price);
    let btcSent = satoshiSent * 0.00000001;
    let sendValue = numPrice * btcSent;
    if (merkleRootProof === root) {
      proofElem = <div className="merkle-root-proof proof-true"> merkle root proof: {merkleRootProof} </div>;
    } else {
      proofElem = <div className="merkle-root-proof proof-false"> merkle root proof: {merkleRootProof} </div>;
    }
    return (
      <div className="tree-box">
        <div className="data-box">
          <BlockData blockInfo={blockInfo} txs={txs} />
        </div>
        <div className="merkle-root-box">
          <div className="merkle-root" onClick={() => this.pickRandomTx()}>
            Merkle Root: {root}
          </div>
          {proofElem}
        </div>
        <div className="data-box">
          <TxData txData={txData} txs={txs} />
        </div>
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
