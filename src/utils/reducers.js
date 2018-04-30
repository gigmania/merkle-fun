import {
  TX_DATA,
  ROOT_TXS,
  MERKLE_TREE,
  MERKLE_ROOT_PROOF,
  BLOCK_INFO,
  PROOF_PATH,
  PATH_PAIR,
  TX_PROOF
} from './actions';

const DEFAULT_STATE = {
  txData: '',
  rootTxs: {},
  merkleTree: [],
  merkleRootProof: '',
  txProof: '',
  blockInfo: {},
  proofPath: [],
  pathPair: []
};

const setTxData = (state, action) => Object.assign({}, state, { txData: action.payload });
const setRootTxs = (state, action) => Object.assign({}, state, { rootTxs: action.payload });
const setMerkleTree = (state, action) => Object.assign({}, state, { merkleTree: action.payload });
const setMerkleRootProof = (state, action) => Object.assign({}, state, { merkleRootProof: action.payload });
const setBlockInfo = (state, action) => Object.assign({}, state, { blockInfo: action.payload });
const setProofPath = (state, action) => Object.assign({}, state, { proofPath: action.payload });
const setPathPair = (state, action) => Object.assign({}, state, { pathPair: action.payload });
const setTxProof = (state, action) => Object.assign({}, state, { txProof: action.payload });

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case TX_DATA:
      return setTxData(state, action);
    case ROOT_TXS:
      return setRootTxs(state, action);
    case MERKLE_TREE:
      return setMerkleTree(state, action);
    case MERKLE_ROOT_PROOF:
      return setMerkleRootProof(state, action);
    case BLOCK_INFO:
      return setBlockInfo(state, action);
    case PROOF_PATH:
      return setProofPath(state, action);
    case PATH_PAIR:
      return setPathPair(state, action);
    case TX_PROOF:
      return setTxProof(state, action);
    default:
      return state;
  }
};

export default rootReducer;
