import { TX_DATA } from './actions';

export function broadcastTxData(tx) {
  return { type: TX_DATA, payload: tx };
}

// *************************************** /

export function txData(tx) {
  return dispatch => {
    dispatch(broadcastTxData(tx));
  };
}
