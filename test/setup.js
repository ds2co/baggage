global.expect = require('chai').expect;
global.assert = require('chai').assert;
global.localStorage = require('./mocks/stores.js').createStorage();
global.sessionStorage = require('./mocks/stores.js').createStorage();
