import { TX_DATA } from './actions';

const DEFAULT_STATE = {
  txData: {}
};

const setTxData = (state, action) => Object.assign({}, state, { txData: action.payload });

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case TX_DATA:
      return setTxData(state, action);
    default:
      return state;
  }
};

export default rootReducer;
