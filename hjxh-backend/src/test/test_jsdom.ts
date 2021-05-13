// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

import {JSDOM} from 'jsdom'
import {DEFAULT_USER_AGENT} from "../../../hjxh-frontend/src/const";


const { window } = new JSDOM(``, {
  url: 'https://mms.pinduoduo.com/login',
  pretendToBeVisual: true,
  userAgent: DEFAULT_USER_AGENT
});

console.log({window})

console.log('finished')