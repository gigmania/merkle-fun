import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findProofPath, showTxData } from '../utils/actionCreators';

import '../styles/App.css';

class TxData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomTx: ''
    };
  }
  makeProof() {
    this.props.getProofPath(this.props.txs, this.props.txData);
  }
  render() {
    let txProofBtn;
    if (this.props.proofPath && this.props.proofPath.length < 1) {
      txProofBtn = (
        <div className="tx-root-proof">
          <button className="tx-proof btn-blue" type="button" onClick={() => this.makeProof()}>
            <span> PROVE TX IN ROOT </span>
          </button>
        </div>
      );
    }
    return (
      <div className="tx-details-box">
        <div className="tx-details">
          <span className="block-text-title">tx hash:</span> <span className="block-text">{this.props.txData} </span>
        </div>
        {txProofBtn}
      </div>
    );
  }
}

const mapStateToProps = state => ({ proofPath: state.proofPath });
const mapDispatchToProps = (dispatch: Function) => ({
  getProofPath(txs, tx) {
    dispatch(findProofPath(txs, tx));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TxData);
