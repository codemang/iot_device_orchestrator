const LightController = require('./light_controller.js');
const ApiClient = require('./api_client.js');
const readline = require('readline');
const { log } = require('./log.js');

const lightController = new LightController();

const main = async (rpiHost) => {
  const apiClient = new ApiClient(rpiHost);
  await lightController.loadDevices();

  log("Loaded all smart devices")
  log("Press q to quit")

  // Prepare to listen to key presses.
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (str, key) => {
    if (str === 'a') {
      apiClient.triggerSingleClick();
    } else if (str === 's') {
      apiClient.triggerDoubleClick();
    } else if (str === 'd') {
      apiClient.triggerHold();
    } else if (str === 'q') {
      process.exit();
    }
  })
};

const rpiHost = process.argv[2]

if (!rpiHost) {
  throw 'You must supply the RPI host as a CLI argument';
}

main(rpiHost);

// Prevent the node process from exiting.
process.stdin.resume();
