import React, { Component } from 'react';
import moment from 'moment';

import '../styles/Timestamp.css';

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
    this.startTimer();
    this.setNewBlockTime();
  }

  setNewBlockTime() {
    let secondsAgo = moment.unix(this.props.blockTime).fromNow();
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

export default Timestamp;
