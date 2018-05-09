// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findProofPath } from '../utils/actionCreators';

import '../styles/App.css';

type Props = {
  txProof: string,
  root: string,
  txs: (?string)[],
  proofPath:  (?string)[][],
  txData: string,
  getProofPath: Function
};

class TxData extends Component<Props> {
  makeProof() {
    this.props.getProofPath(this.props.txs, this.props.txData);
  }
  render() {
    let txProofBtn;
    let txRootProof;
    const { txProof, root } = this.props;
    if (this.props.proofPath && this.props.proofPath.length < 1) {
      txProofBtn = (
        <div className="tx-root-proof">
          <button className="tx-proof-btn btn-blue" type="button" onClick={() => this.makeProof()}>
            <span> PROVE TX IN BLOCK </span>
          </button>
        </div>
      );
    }
    if (txProof.length > 0) {
      if (txProof === root) {
        txRootProof = (
          <div className="tx-details tx-proof">
            <span className="block-text-title">tx proof:</span>
            <span className="proof-text proof-true">{this.props.txProof} </span>
          </div>
        );
      } else {
        txRootProof = (
          <div className="tx-details tx-proof">
            <span className="block-text-title">tx proof:</span>
            <span className="proof-text proof-false">{this.props.txProof} </span>
          </div>
        );
      }
    }

    return (
      <div className="tx-details-box">
        <div className="tx-details tx-raw">
          <span className="block-text-title">tx hash:</span> <span className="block-text">{this.props.txData} </span>
        </div>
        {txRootProof}
        {txProofBtn}
      </div>
    );
  }
}

const mapStateToProps = state => ({ proofPath: state.proofPath, txProof: state.txProof });
const mapDispatchToProps = (dispatch: Function) => ({
  getProofPath(txs, tx) {
    dispatch(findProofPath(txs, tx));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TxData);
