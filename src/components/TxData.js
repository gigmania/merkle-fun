import React from 'react';
import { connect } from 'react-redux';
import { findProofPath } from '../utils/actionCreators';

import '../styles/App.css';

const TxData = props => {
  function makeProof() {
    console.log('i feel the click ---> ', props);
    props.getProofPath(props.txs, props.txData);
  }
  console.log(props);
  return (
    <div className="tx-details-box">
      <div className="tx-details" onClick={() => makeProof()}>
        tx hash: {props.txData}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({ proofPath: state.proofPath });
const mapDispatchToProps = (dispatch: Function) => ({
  getProofPath(txs, tx) {
    dispatch(findProofPath(txs, tx));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TxData);
