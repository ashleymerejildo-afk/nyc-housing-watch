// backend/src/config/env.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3001,
  socrata: {
    baseUrl: 'https://data.cityofnewyork.us/resource/csn4-vhvf.json',
    appToken: process.env.SOCRATA_APP_TOKEN || ''
  },
  geoclient: {
    baseUrl: 'https://api.cityofnewyork.us/geoclient/v1/address.json',
    appId: process.env.GEOCLIENT_ID || '',
    appKey: process.env.GEOCLIENT_KEY || ''
  }
};
