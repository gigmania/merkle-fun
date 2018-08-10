// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Level from './Level';

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
  render() {
    console.log(this.props);
    const { merkleTree, merkleRootProof } = this.props;
    return (
      <div className="tree-box">
        {merkleTree.map((trxs, index) => <Level key={index} index={index} txs={trxs} merkleProof={merkleRootProof} />)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  merkleRootProof: state.merkleRootProof,
  merkleTree: state.merkleTree
});

export default connect(mapStateToProps)(Tree);
