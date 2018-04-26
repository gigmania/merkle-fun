import { TX_DATA, ROOT_TXS, MERKLE_TREE, UI_TREE, BLOCK_INFO } from './actions';

const DEFAULT_STATE = {
  txData: '',
  rootTxs: {},
  merkleTree: [],
  uiTree: [],
  blockInfo: {}
};

const setTxData = (state, action) => Object.assign({}, state, { txData: action.payload });
const setRootTxs = (state, action) => Object.assign({}, state, { rootTxs: action.payload });
const setMerkleTree = (state, action) => Object.assign({}, state, { merkleTree: action.payload });
const setUiTree = (state, action) => Object.assign({}, state, { uiTree: action.payload });
const setBlockInfo = (state, action) => Object.assign({}, state, { blockInfo: action.payload });

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case TX_DATA:
      return setTxData(state, action);
    case ROOT_TXS:
      return setRootTxs(state, action);
    case MERKLE_TREE:
      return setMerkleTree(state, action);
    case UI_TREE:
      return setUiTree(state, action);
    case BLOCK_INFO:
      return setBlockInfo(state, action);
    default:
      return state;
  }
};

export default rootReducer;
