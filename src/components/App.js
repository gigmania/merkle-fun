import React, { Component } from 'react';
import { Provider } from 'react-redux';
import sha256 from 'js-sha256';
import { store } from '../utils/store';
import Level from './Level';
import NetworkData from './NetworkData';
import BlockData from './BlockData';
import TxData from './TxData';
import '../styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      root: '',
      merkleTree: [],
      uiTree: [],
      blockInfo: {},
      satoshiSent: '',
      txsCount: '',
      price: ''
    };
    this.merkleProofRoot = this.merkleProofRoot.bind(this);
    this.hashPair = this.hashPair.bind(this);
    this.castMerkleRoot = this.castMerkleRoot.bind(this);
  }
  componentDidMount() {
    let that = this;
    this.getSummaryData();
    this.getLastestBlock().then(result => {
      let parseObj = JSON.parse(result);
      //console.log(parseObj);
      that.getBlockData(parseObj.hash).then(deets => {
        let blockInfo = JSON.parse(deets);
        that.setState({
          blockInfo: blockInfo
        });
      });
    });
    this.getLastestHash()
      .then(that.getMerkleRootPlusTxs)
      .then(([root, txs]) => {
        console.log(root);
        that.setRoot(root);
        const isValid = that.castMerkleRoot(txs) === root;
        let tree = that.state.merkleTree;
        tree.pop();
        tree.unshift([root]);
        // const tx = that.randomize(txs);
        // const proof = that.merkleProof(txs, tx);
        // console.log(proof);
        // const isValid = that.merkleProofRoot(proof, tx) === root;
        console.log(isValid);
        that.setUiTree(tree);
      });
  }

  setRoot(root) {
    console.log('i am the root ----> ', root);
    this.setState({ root: root });
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

  setUiTree(tree) {
    this.setState({ uiTree: tree });
  }

  randomize(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  byteify(hex) {
    return hex.match(/../g).reduce((acc, hex) => [...acc, parseInt(hex, 16)], []);
  }

  hexify(bytes) {
    let hex = bytes.reduce((acc, bytes) => acc + bytes.toString(16).padStart(2, '0'), '');
    return hex;
  }

  getLastestHash() {
    return fetch('https://blockchain.info/q/latesthash?cors=true').then(result => result.text());
  }

  pairify(arr) {
    let tree = this.state.merkleTree;
    tree.unshift(arr);
    this.setState({ merkleTree: tree });
    return Array.from(Array(Math.ceil(arr.length / 2)), (_, i) => arr.slice(i * 2, i * 2 + 2));
  }

  castMerkleRoot(txs) {
    //console.log(txs);
    if (txs.length === 1) {
      return txs[0];
    } else {
      //return this.castMerkleRoot(this.pairify(txs).reduce((tree, pair) => [...tree, this.hashPair(...pair)], []));
      return this.castMerkleRoot(
        this.pairify(txs).reduce((tree, pair) => {
          return [...tree, this.hashPair(...pair)];
        }, [])
      );
    }
  }

  getMerkleRootPlusTxs(block) {
    return fetch(`https://blockchain.info/rawblock/${block}?cors=true`)
      .then(result => result.json())
      .then(data => [data.mrkl_root, data.tx.map(txs => txs.hash)]);
  }

  hashPair(a, b = a) {
    const bytes = this.byteify(`${b}${a}`).reverse();
    const hashed = sha256.array(sha256.array(bytes));
    return this.hexify(hashed.reverse());
  }

  merkleProof(txs, tx, proof = []) {
    if (txs.length === 1) {
      return proof;
    }
    const tree = [];
    this.pairify(txs).forEach(pair => {
      const hash = this.hashPair(...pair);

      if (pair.includes(tx)) {
        const idx = (pair[0] === tx) | 0;
        proof.push([idx, pair[idx]]);
        tx = hash;
      }

      tree.push(hash);
    });
    return this.merkleProof(tree, tx, proof);
  }

  merkleProofRoot(proof, tx) {
    return proof.reduce((root, [idx, tx]) => (idx ? this.hashPair(root, tx) : this.hashPair(tx, root)), tx);
  }

  render() {
    const { uiTree, blockInfo, price, satoshiSent, txsCount, root } = this.state;
    let numPrice = Number(price);
    let btcSent = satoshiSent * 0.00000001;
    let sendValue = numPrice * btcSent;
    return (
      <Provider store={store}>
        <div className="app-box">
          <header className="app-header">
            <h3 className="app-title">We are having Merkle Fun</h3>
          </header>
          <div className="data-box">
            <NetworkData price={price} btcSent={btcSent} sendValue={sendValue} txsCount={txsCount} />
            <BlockData blockInfo={blockInfo} />
            <TxData />
          </div>
          <h1> {root} </h1>
          {uiTree.map((txs, index) => <Level key={index} index={index} txs={txs} />)}
        </div>
      </Provider>
    );
  }
}

export default App;
