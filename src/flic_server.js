const LightController = require('./light_controller.js');
const ApiClient = require('./api_client.js');
const fliclib = require("./flic/clientlib/nodejs/fliclibNodeJs");

const FlicClient = fliclib.FlicClient;
const FlicConnectionChannel = fliclib.FlicConnectionChannel;
const FlicScanner = fliclib.FlicScanner;

const apiClient = new ApiClient('http://localhost:4000');

const { log } = require('./log.js');

const initFlic = () => {
  var flicClient = new FlicClient("localhost", 5551);

  const listenToButton = bdAddr => {
    var cc = new FlicConnectionChannel(bdAddr);
    flicClient.addConnectionChannel(cc);

    cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
      log("Received click: "+ clickType)

      if (clickType === 'ButtonSingleClick') {
        apiClient.triggerSingleClick();
      } else if (clickType === 'ButtonDoubleClick') {
        apiClient.triggerDoubleClick();
      } else if (clickType === 'ButtonHold') {
        apiClient.triggerHold();
      }
    });
  }

  flicClient.once("ready", function() {
    log("Connected to Flic daemon!");

    flicClient.getInfo(function(info) {
      info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
        listenToButton(bdAddr);
      });
    });
  });
}

const main = async () => {
  initFlic();
}

main();

// Prevent the node process from exiting.
process.stdin.resume();
