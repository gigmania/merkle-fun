import React from 'react';
import '../styles/App.css';

const TxData = props => {
  return (
    <div className="tx-details-box">
      <div className="tx-details">tx hash: {props.txData} </div>
    </div>
  );
};

export default TxData;
