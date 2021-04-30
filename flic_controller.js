const LightController = require('./light_controller.js');
const fliclib = require("./flic/clientlib/nodejs/fliclibNodeJs");

const FlicClient = fliclib.FlicClient;
const FlicConnectionChannel = fliclib.FlicConnectionChannel;
const FlicScanner = fliclib.FlicScanner;

const lightController = new LightController();

const { log } = require('./log.js');

const initFlic = () => {
  var flicClient = new FlicClient("localhost", 5551);

  const listenToButton = bdAddr => {
    var cc = new FlicConnectionChannel(bdAddr);
    flicClient.addConnectionChannel(cc);

    cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
      log("Received click: "+clickType)

      if (clickType === 'ButtonSingleClick') {
        lightController.processSingleClick();
      } else if (clickType === 'ButtonDoubleClick') {
        lightController.processDoubleClick();
      } else if (clickType === 'ButtonHold') {
        lightController.processHold();
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
  await lightController.loadDevices();
  log("Loaded all smart devices")

  initFlic();
}

main();

// Prevent the node process from exiting.
process.stdin.resume();
