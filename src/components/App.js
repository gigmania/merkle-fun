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
            <div className="app-title">MERKLATOR</div>
          </header>
          <Tree />
        </div>
      </Provider>
    );
  }
}

export default App;
