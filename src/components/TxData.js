// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/App.css';
import '../styles/TxData.css';

type Props = {
  txProof: string,
  root: string,
  txs: (?string)[],
  proofPath: (?string)[][],
  txData: string,
  getProofPath: Function
};

class TxData extends Component<Props> {
  render() {
    let txRootProof;
    let rootProofSolution;
    const { txProof, root } = this.props;
    if (txProof.length > 0) {
      if (txProof === root) {
        rootProofSolution = <span className="proof-text proof-true text--hash">{this.props.txProof} </span>;
      } else {
        rootProofSolution = <span className="proof-text proof-false text--hash">{this.props.txProof} </span>;
      }
      txRootProof = (
        <div className="tx-details tx-proof">
          <span className="block-text-title block-text-title--details">Tx Proof:</span>
          {rootProofSolution}
        </div>
      );
    }

    return (
      <div className="tx-details-box">
        <div className="tx-details tx-raw">
          <span className="block-text-title block-text-title--details">Random TX Hash:</span>
          <span className="tx-text text--hash">{this.props.txData} </span>
        </div>
        {txRootProof}
      </div>
    );
  }
}

const mapStateToProps = state => ({ proofPath: state.proofPath, txProof: state.txProof });

export default connect(mapStateToProps)(TxData);
