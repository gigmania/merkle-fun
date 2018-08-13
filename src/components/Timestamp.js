import React, { Component } from 'react';
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
      secondsAgo: secondsAgo
    });
  }

  startTimer() {
    setInterval(() => {
      this.setNewBlockTime();
    }, 20000);
  }

  render() {
    console.log('timestamp -----> ', this.props.blockTime);
    return (
      <div className="time-box">
        <div className="time-time"> {this.state.secondsAgo} </div>
      </div>
    );
  }
}

export default Timestamp;
