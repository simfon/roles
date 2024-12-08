import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // don't need to specify localhost url in axios http address
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

require('./index.css');
// style


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
// registerServiceWorker();
