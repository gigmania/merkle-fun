import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

export const store = createStore(reducer, compose(applyMiddleware(thunk)));
