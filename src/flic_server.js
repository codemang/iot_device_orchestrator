const ApiClient = require('./api_client');
const fliclib = require('../flic/clientlib/nodejs/fliclibNodeJs');
const { log } = require('./log');

const { FlicClient } = fliclib;
const { FlicConnectionChannel } = fliclib;

const apiClient = new ApiClient('http://localhost:4000');

const initFlic = () => {
  const flicClient = new FlicClient('localhost', 5551);

  const listenToButton = (bdAddr) => {
    const cc = new FlicConnectionChannel(bdAddr);
    flicClient.addConnectionChannel(cc);

    cc.on('buttonSingleOrDoubleClickOrHold', (clickType) => {
      log(`Received click: ${clickType}`);

      if (clickType === 'ButtonSingleClick') {
        apiClient.triggerSingleClick();
      } else if (clickType === 'ButtonDoubleClick') {
        apiClient.triggerDoubleClick();
      } else if (clickType === 'ButtonHold') {
        apiClient.triggerHold();
      }
    });
  };

  flicClient.once('ready', () => {
    log('Connected to Flic daemon!');

    flicClient.getInfo((info) => {
      info.bdAddrOfVerifiedButtons.forEach((bdAddr) => {
        listenToButton(bdAddr);
      });
    });
  });
};

const main = async () => {
  initFlic();
};

main();

// Prevent the node process from exiting.
process.stdin.resume();
