const readline = require('readline');
const ApiClient = require('./api_client');
const { log } = require('./log');

const main = async (apiServerHost) => {
  const apiClient = new ApiClient(apiServerHost);

  log('Loaded all smart devices');
  log('Press q to quit');

  // Prepare to listen to key presses.
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (str) => {
    if (str === 'a') {
      apiClient.triggerSingleClick();
    } else if (str === 's') {
      apiClient.triggerDoubleClick();
    } else if (str === 'd') {
      apiClient.triggerHold();
    } else if (str === 'q') {
      process.exit();
    }
  });
};

const apiServerHost = process.argv[2];

if (!apiServerHost) {
  throw new Error('You must supply the API server host as a CLI argument!');
}

main(apiServerHost);

// Prevent the Node process from exiting.
process.stdin.resume();
