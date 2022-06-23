const moment = require('moment-timezone');

const log = (message) => {
  const timestamp = moment().tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a');
  console.log(`[${timestamp}]: ${message}`); // eslint-disable-line no-console
};

module.exports = { log };
