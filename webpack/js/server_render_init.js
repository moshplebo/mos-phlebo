import React from 'react';
import { renderToString } from 'react-dom/server'
import App from './app.jsx'
import Store from './store'

const serverRender = function(data) {
  Store.setData(data,false) ;

  return renderToString(
      <App />
  );
};
module.exports = serverRender;
