import { TX_DATA, ROOT_TXS, MERKLE_TREE, UI_TREE, BLOCK_INFO } from './actions';

export function broadcastTxData(tx) {
  return { type: TX_DATA, payload: tx };
}

export function broadcastRootTxs(rootTxs) {
  return { type: ROOT_TXS, payload: rootTxs };
}

export function broadcastMerkleTree(merkleTree) {
  return { type: MERKLE_TREE, payload: merkleTree };
}

export function broadcastUiTree(uiTree) {
  return { type: UI_TREE, payload: uiTree };
}

// *************************************** /

export function txData(tx) {
  return dispatch => {
    console.log('i am the tx in the action creators --->', tx);
    dispatch(broadcastTxData(tx));
  };
}

export function getMerkleRootPlusTxs(latestHash) {
  console.log('in get latest root and txs ---> ', latestHash);
  return dispatch => {
    fetch(`https://blockchain.info/rawblock/${latestHash}?cors=true`)
      .then(result => result.json())
      .then(data => [data.mrkl_root, data.tx.map(txs => txs.hash)])
      .then(([root, txs]) => {
        let rootTxs = {};
        rootTxs.root = root;
        rootTxs.txs = txs;
        dispatch(broadcastRootTxs(rootTxs));
      });
  };
}

export function getLatestHash() {
  console.log('in get latest hash');
  return dispatch => {
    fetch('https://blockchain.info/q/latesthash?cors=true').then(result => {
      let hash = result.text();
      dispatch(getMerkleRootPlusTxs(hash));
    });
  };
}
