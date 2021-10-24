import 'normalize.css';

// https://materialdesignicons.com/
import 'mdi/css/materialdesignicons.min.css';
import 'react-date-picker/index.css';


import '../css/application.scss';
import '../css/admin.scss';

import "babel-polyfill";

require("expose?Modernizr!./modernizr.js");
require("expose?TypografRu!./typograf.js");

import React from 'react';
import {render} from 'react-dom'
import Store from './store'


window.onload = function(){
    Store.initData(initialData);
};

let element = document.getElementById("init_data");
element.parentNode.removeChild(element);
