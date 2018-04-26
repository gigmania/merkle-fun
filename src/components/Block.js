import React, { Component } from 'react';
import { connect } from 'react-redux';
import { txData } from '../utils/actionCreators';
import '../styles/App.css';

class Block extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }
  setTxToProve() {
    this.props.showTxData(this.props.transaction);
  }
  merkleProofPath() {}
  render() {
    const { level, transaction, txData } = this.props;
    let txBlock;
    if (txData === transaction) {
      console.log('i am the hash of the selected block', txData);
      console.log(this.props);
      txBlock = (
        <div
          className={`tree-block level-${level}-block selected-block`}
          onClick={() => this.merkleProofPath(txData)}
        />
      );
    } else {
      txBlock = <div className={`tree-block level-${level}-block`} onClick={() => this.setTxToProve()} />;
    }
    return txBlock;
  }
}

// export default Block;

const mapStateToProps = state => ({ txData: state.txData });
const mapDispatchToProps = (dispatch: Function) => ({
  showTxData(tx) {
    dispatch(txData(tx));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Block);
