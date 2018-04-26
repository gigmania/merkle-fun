import React from 'react';
import '../styles/App.css';

const NetworkData = props => {
  const { price, btcSent, sendValue, txsCount } = props;
  return (
    <div className="btc-summary-info-box">
      <div className="summary-info">BTC Price: {Number(price)}</div>
      <div className="summary-info">BTC Sent: {btcSent} </div>
      <div className="summary-info">Send Value: ${Math.round(sendValue)} </div>
      <div className="summary-info">TXS Count: {txsCount} </div>
    </div>
  );
};

export default NetworkData;
