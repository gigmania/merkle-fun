import sha256 from 'js-sha256';

import { store } from './store';

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

export function broadcastBlockInfo(blockInfo) {
  return { type: BLOCK_INFO, payload: blockInfo };
}

export function broadcastMerkleRootProof(rootProof) {
  return { type: MERKLE_ROOT_PROOF, payload: rootProof };
}

export function broadcastMerkleTree(merkleTree) {
  return { type: MERKLE_TREE, payload: merkleTree };
}

export function broadcastPathPair(pathPair) {
  return { type: PATH_PAIR, payload: pathPair };
}

export function broadcastProofPath(proofPath) {
  return { type: PROOF_PATH, payload: proofPath };
}

export function broadcastRootTxs(rootTxs) {
  console.log('in the creator');
  return { type: ROOT_TXS, payload: rootTxs };
}

export function broadcastTxData(tx) {
  return { type: TX_DATA, payload: tx };
}

export function broadcastTxProof(txProof) {
  return { type: TX_PROOF, payload: txProof };
}

export function broadcastTxsFetchStatus(status) {
  return { type: TXS_FETCH_STATUS, payload: status };
}

// *************************************** /

function initSocket() {
  let wsSocket;
  let subMsg = { op: 'blocks_sub' };
  if (!wsSocket) {
    wsSocket = new WebSocket('wss://ws.blockchain.info/inv');
    wsSocket.onopen = function(event) {
      console.log('SOCKET IS OPEN');
      wsSocket.send(JSON.stringify(subMsg));
    };
    wsSocket.onmessage = function(event) {
      let blockData = JSON.parse(event.data);
      let currentState = store.getState();
      console.log('Latest Block Data ----> ', blockData);
      console.log(currentState);
      store.dispatch(fetchBlockData(blockData.x.hash));
      store.dispatch(resetProofs());
    };
  }

  function getSocket() {
    return wsSocket;
  }

  return {
    getSocket
  };
}

const socket = initSocket();

// DISPATCH LOGIC

let merkleTree = [];
let proofPairPath = [];

export function randomize(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function byteify(hex) {
  return hex.match(/../g).reduce((acc, hex) => [...acc, parseInt(hex, 16)], []);
}

export function hexify(bytes) {
  let hex = bytes.reduce((acc, bytes) => acc + bytes.toString(16).padStart(2, '0'), '');
  return hex;
}

export function hashPair(a, b = a) {
  const bytes = byteify(`${b}${a}`).reverse();
  const hashed = sha256.array(sha256.array(bytes));
  return hexify(hashed.reverse());
}

export function txData(tx) {
  return dispatch => {
    dispatch(broadcastTxData(tx));
  };
}

export function getMerkleRootPlusTxs(latestHash) {
  return fetch(`https://blockchain.info/rawblock/${latestHash}?cors=true`)
    .then(result => result.json())
    .then(data => [
      data.mrkl_root,
      data.tx.map(txs => {
        return txs.hash;
      })
    ]);
}

export function pairify(arr) {
  return Array.from(Array(Math.ceil(arr.length / 2)), (_, i) => arr.slice(i * 2, i * 2 + 2));
}

export function pairifyForTree(arr) {
  merkleTree.unshift(arr);
  return Array.from(Array(Math.ceil(arr.length / 2)), (_, i) => arr.slice(i * 2, i * 2 + 2));
}

export function castMerkleRoot(txs) {
  if (txs.length === 1) {
    return txs[0];
  } else {
    return castMerkleRoot(
      pairifyForTree(txs).reduce((tree, pair) => {
        return [...tree, hashPair(...pair)];
      }, [])
    );
  }
}

export function setMerkleTree(tree) {
  return dispatch => {
    dispatch(broadcastMerkleTree(tree));
  };
}

export function setRootTxs(root, txs) {
  let rootTxs = {
    root,
    txs
  };
  return dispatch => {
    dispatch(broadcastRootTxs(rootTxs));
  };
}

export function setMerkleRootProof(rootProof) {
  return dispatch => {
    dispatch(broadcastMerkleRootProof(rootProof));
  };
}

export function resetProofs() {
  console.log('in the reset proofs');
  return dispatch => {
    dispatch(broadcastRootTxs({}));
    dispatch(broadcastMerkleRootProof(''));
    dispatch(broadcastMerkleTree([]));
    dispatch(broadcastProofPath([]));
    dispatch(broadcastPathPair([]));
    dispatch(broadcastTxProof(''));
    dispatch(broadcastTxData(''));
    dispatch(broadcastTxsFetchStatus('INIT'));
  };
}

export function getLatestHash(root, txs) {
  merkleTree = [];
  return dispatch => {
    dispatch(broadcastTxsFetchStatus('FETCHING'));
    let hashArray = txs.map(tx => {
      return tx.hash;
    });
    dispatch(setRootTxs(root, hashArray));
    let calcRoot = castMerkleRoot(hashArray);
    dispatch(setMerkleRootProof(calcRoot));
    merkleTree.unshift([root]);
    dispatch(setMerkleTree(merkleTree));
    dispatch(broadcastTxsFetchStatus('DONE'));
  };
}

// proof of a single transaction

export function merkleProof(txs, tx, proof = [], altProof = []) {
  if (txs.length === 1) {
    proofPairPath = altProof.slice();
    return proof;
  }
  const tree = [];
  pairify(txs).forEach(pair => {
    const hash = hashPair(...pair);

    if (pair.includes(tx)) {
      let idx;
      if (pair[0] === tx) {
        idx = 1;
        altProof.push([0, pair[0]]);
      } else {
        idx = 0;
        altProof.push([1, pair[1]]);
      }
      proof.push([idx, pair[idx]]);
      tx = hash;
    }
    tree.push(hash);
  });
  return merkleProof(tree, tx, proof, altProof);
}

export function setProofPath(path) {
  return dispatch => {
    dispatch(broadcastProofPath(path));
  };
}

export function setPathPair(path) {
  return dispatch => {
    dispatch(broadcastPathPair(path));
  };
}

export function merkleProofRoot(proof, tx) {
  return proof.reduce((root, [idx, tx]) => {
    return idx ? hashPair(root, tx) : hashPair(tx, root);
  }, tx);
}

export function findProofPath(txs, tx) {
  proofPairPath = [];
  return dispatch => {
    let proof = merkleProof(txs, tx);
    dispatch(setProofPath(proof));
    dispatch(setPathPair(proofPairPath));
    let proofRoot = merkleProofRoot(proof, tx);
    dispatch(broadcastTxProof(proofRoot));
    dispatch(broadcastTxsFetchStatus('PATH'));
  };
}

// Block Info
export function fetchBlockData(blockHash) {
  return dispatch => {
    fetch(`https://blockchain.info/rawblock/${blockHash}?cors=true`)
      .then(result => result.text())
      .then(deets => {
        let blockInfo = JSON.parse(deets);
        dispatch(broadcastBlockInfo(blockInfo));
      });
  };
}

export function fetchLatestBlock() {
  return dispatch => {
    fetch('https://blockchain.info/latestblock?cors=true')
      .then(result => result.text())
      .then(blockData => {
        let parseBlock = JSON.parse(blockData);
        dispatch(fetchBlockData(parseBlock.hash));
      });
  };
}
