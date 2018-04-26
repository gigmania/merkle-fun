import { TX_DATA } from './actions';

export function broadcastTxData(tx) {
  return { type: TX_DATA, payload: tx };
}

// *************************************** /

export function txData(tx) {
  return dispatch => {
    console.log('i am the tx in the action creators --->', tx);
    dispatch(broadcastTxData(tx));
  };
}
