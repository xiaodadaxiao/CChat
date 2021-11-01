const envConfig = require('./env');
const keys = require('./keys');

module.exports = {
  ...envConfig,
  ...keys,
};
