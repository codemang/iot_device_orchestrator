const Lifx = require('./lifx');
const fliclib = require("./flic/clientlib/nodejs/fliclibNodeJs");
const FlicClient = fliclib.FlicClient;
const FlicConnectionChannel = fliclib.FlicConnectionChannel;
const FlicScanner = fliclib.FlicScanner;

let lifxLight;

const initFlic = () => {
  var flicClient = new FlicClient("localhost", 5551);

  const listenToButton = bdAddr => {
    var cc = new FlicConnectionChannel(bdAddr);
    flicClient.addConnectionChannel(cc);

    cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
      if (clickType === 'ButtonUp') {
        Lifx.togglePower(lifxLight);
      }
    });
  }

  flicClient.once("ready", function() {
    console.log("Connected to daemon!");

    flicClient.getInfo(function(info) {
      info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
        listenToButton(bdAddr);
      });
    });
  });
}

const main = async () => {
  lifxLight = await Lifx.loadLight('Nate')
  initFlic();
}

main();

// Prevent the node process from exiting.
process.stdin.resume();
