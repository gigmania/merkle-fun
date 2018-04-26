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
  render() {
    const { level, key, transaction } = this.props;
    return <div className={`tree-block level-${level}-block`} />;
  }
}

const mapStateToProps = state => ({ txData: state.txData });
const mapDispatchToProps = (dispatch: Function) => ({
  showTxData(tx) {
    dispatch(txData(tx));
  }
});

export default connect(mapDispatchToProps)(Block);
