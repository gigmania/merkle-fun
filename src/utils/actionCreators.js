import { TX_DATA, ROOT_TXS, MERKLE_TREE, MERKLE_ROOT_PROOF, BLOCK_INFO } from './actions';
import sha256 from 'js-sha256';

export function broadcastTxData(tx) {
  return { type: TX_DATA, payload: tx };
}

export function broadcastRootTxs(rootTxs) {
  return { type: ROOT_TXS, payload: rootTxs };
}

export function broadcastMerkleTree(merkleTree) {
  return { type: MERKLE_TREE, payload: merkleTree };
}

export function broadcastMerkleRootProof(rootProof) {
  return { type: MERKLE_ROOT_PROOF, payload: rootProof };
}

// *************************************** /

let merkleTree = [];

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
    console.log('i am the tx in the action creators --->', tx);
    dispatch(broadcastTxData(tx));
  };
}

export function getMerkleRootPlusTxs(latestHash) {
  return fetch(`https://blockchain.info/rawblock/${latestHash}?cors=true`)
    .then(result => result.json())
    .then(data => [data.mrkl_root, data.tx.map(txs => txs.hash)]);
}

export function pairifyForTree(arr) {
  merkleTree.unshift(arr);
  return Array.from(Array(Math.ceil(arr.length / 2)), (_, i) => arr.slice(i * 2, i * 2 + 2));
}

export function castMerkleRoot(txs) {
  if (txs.length === 1) {
    return txs[0];
  } else {
    //return this.castMerkleRoot(this.pairify(txs).reduce((tree, pair) => [...tree, this.hashPair(...pair)], []));
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

export function getLatestHash() {
  console.log('in get latest hash');
  merkleTree = [];
  return dispatch => {
    fetch('https://blockchain.info/q/latesthash?cors=true')
      .then(result => result.text())
      .then(getMerkleRootPlusTxs)
      .then(([root, txs]) => {
        dispatch(setRootTxs(root, txs));
        let calcRoot = castMerkleRoot(txs);
        dispatch(setMerkleRootProof(calcRoot));
        merkleTree.unshift([root]);
        dispatch(setMerkleTree(merkleTree));
      });
  };
}
