import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store'; // Adjust the path as necessary
import App from './App';
import './styles/index.css'; // Adjust the path as necessary

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);