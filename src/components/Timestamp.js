import React, { Component } from 'react';
// import { connect } from 'react-redux';
import moment from 'moment';

import '../styles/Timestamp.css';

// console.log(moment.unix(blockInfo.time).format('ddd MMM Do YYYY kk:mm:ss'));
// console.log(moment.unix(blockInfo.time).fromNow(false, 'mm:ss'));

class Timestamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: 0,
      secondsAgo: ''
    };
    this.setNewBlockTime = this.setNewBlockTime.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }
  componentWillMount() {
    console.log('component will mount');
    this.startTimer();
    this.setNewBlockTime();
  }

  setNewBlockTime() {
    // let secondsAgo = Math.round(nowTime / 1000) - this.props.blockTime;
    let secondsAgo = moment.unix(this.props.blockTime).fromNow();
    console.log('setting time yip yip', secondsAgo);
    this.setState({
      secondsAgo: secondsAgo,
      timestamp: this.props.blockTime
    });
  }

  startTimer() {
    setInterval(() => {
      this.setNewBlockTime();
    }, 60000);
  }

  render() {
    console.log('timestamp -----> ', this.props.blockTime);
    let secondsAgo;
    if (this.props.blockTime === this.state.timestamp) {
      secondsAgo = this.state.secondsAgo;
    } else {
      secondsAgo = moment.unix(this.props.blockTime).fromNow();
    }
    return (
      <div className="time-box">
        <div className="block-details">
          <span className="block-text-title block-text-title--details"> Block Verified:</span>
          <span className="time-time block-text"> {secondsAgo} </span>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => ({
//   blockInfo: state.blockInfo
// });

export default Timestamp;

// export default connect(mapStateToProps)(Timestamp);
