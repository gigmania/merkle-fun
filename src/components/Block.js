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
    //this.props.showTxData(this.props.transaction);
  }
  render() {
    const { level, transaction, txData } = this.props;
    let proofLength = this.props.proofPath.length;
    let onPath = false;
    if (proofLength > 0) {
      for (let i = 0; i < proofLength; i++) {
        if (this.props.proofPath[i][1] === transaction) {
          // console.log('i am on the proofPath');
          // console.log(this.props.proofPath[i]);
          // console.log(i);
          // console.log(this.props);
          onPath = true;
          break;
        }
      }
    }
    //console.log(this.props);

    let txBlock;
    if (txData === transaction) {
      // console.log('i am the hash of the selected block', txData);
      // console.log(this.props);
      txBlock = <div className={`tree-block level-${level}-block selected-block`} />;
    } else if (onPath === true) {
      txBlock = <div className={`tree-block level-${level}-block path-block`} />;
    } else {
      txBlock = <div className={`tree-block level-${level}-block`} />;
    }
    return txBlock;
  }
}

// export default Block;

const mapStateToProps = state => ({ txData: state.txData, proofPath: state.proofPath });
const mapDispatchToProps = (dispatch: Function) => ({
  showTxData(tx) {
    dispatch(txData(tx));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Block);
