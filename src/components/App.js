import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store } from '../utils/store';
import Tree from './Tree';
import '../styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBlock: {}
    };
  }

  render() {
    return (
      <Provider store={store}>
        <div className="app-box">
          <header className="app-header">
            <h3 className="app-title">We are having Merkle Fun</h3>
          </header>
          <Tree />
        </div>
      </Provider>
    );
  }
}

export default App;
