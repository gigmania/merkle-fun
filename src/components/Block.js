import React, { Component } from 'react';
import { connect } from 'react-redux';
import { txData } from '../utils/actionCreators';

import '../styles/Block.css';

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }
  setTxToProve() {
    //this.props.showTxData(this.props.transaction);
  }
  render() {
    const { level, transaction, txData, txProof } = this.props;
    let proofLength = this.props.proofPath.length;
    let pairLength = this.props.pathPair.length;
    let onPath = false;
    let proofPair = false;
    if (proofLength > 0) {
      for (let i = 0; i < proofLength; i++) {
        if (this.props.proofPath[i][1] === transaction) {
          onPath = true;
          break;
        }
      }
    }
    if (pairLength > 0 && onPath === false) {
      for (let j = 0; j < pairLength; j++) {
        if (this.props.pathPair[j][1] === transaction) {
          proofPair = true;
          break;
        }
      }
    }
    let txBlock;
    if (txProof === transaction) {
      txBlock = <div className={`tree-block level-${level}-block tx-proof-block`} />;
    } else if (txData === transaction) {
      txBlock = <div className={`tree-block level-${level}-block selected-block`} />;
    } else if (onPath === true) {
      txBlock = <div className={`tree-block level-${level}-block pair-block`} />;
    } else if (proofPair === true) {
      txBlock = <div className={`tree-block level-${level}-block selected-block`} />;
    } else {
      txBlock = <div className={`tree-block level-${level}-block`} />;
    }
    return txBlock;
  }
}

const mapStateToProps = state => ({
  txData: state.txData,
  proofPath: state.proofPath,
  pathPair: state.pathPair,
  txProof: state.txProof
});
const mapDispatchToProps = (dispatch: Function) => ({
  showTxData(tx) {
    dispatch(txData(tx));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Block);
