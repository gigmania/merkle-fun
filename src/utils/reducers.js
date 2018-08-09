import {
  BLOCK_INFO,
  MERKLE_ROOT_PROOF,
  MERKLE_TREE,
  PATH_PAIR,
  PROOF_PATH,
  ROOT_TXS,
  TX_DATA,
  TX_PROOF,
  TXS_FETCH_STATUS
} from './actions';

const DEFAULT_STATE = {
  blockInfo: {},
  merkleRootProof: '',
  merkleTree: [],
  pathPair: [],
  proofPath: [],
  rootTxs: {},
  txData: '',
  txProof: '',
  txsFetchStatus: ''
};

const setBlockInfo = (state, action) => Object.assign({}, state, { blockInfo: action.payload });
const setMerkleRootProof = (state, action) => Object.assign({}, state, { merkleRootProof: action.payload });
const setMerkleTree = (state, action) => Object.assign({}, state, { merkleTree: action.payload });
const setPathPair = (state, action) => Object.assign({}, state, { pathPair: action.payload });
const setProofPath = (state, action) => Object.assign({}, state, { proofPath: action.payload });
const setRootTxs = (state, action) => Object.assign({}, state, { rootTxs: action.payload });
const setTxData = (state, action) => Object.assign({}, state, { txData: action.payload });
const setTxProof = (state, action) => Object.assign({}, state, { txProof: action.payload });
const setTxsFetchStatus = (state, action) => Object.assign({}, state, { txsFetchStatus: action.payload });

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case BLOCK_INFO:
      return setBlockInfo(state, action);
    case MERKLE_ROOT_PROOF:
      return setMerkleRootProof(state, action);
    case MERKLE_TREE:
      return setMerkleTree(state, action);
    case PATH_PAIR:
      return setPathPair(state, action);
    case PROOF_PATH:
      return setProofPath(state, action);
    case ROOT_TXS:
      return setRootTxs(state, action);
    case TX_DATA:
      return setTxData(state, action);
    case TXS_FETCH_STATUS:
      return setTxsFetchStatus(state, action);
    case TX_PROOF:
      return setTxProof(state, action);
    default:
      return state;
  }
};

export default rootReducer;
