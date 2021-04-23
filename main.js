const Lifx = require('./lifx');
const Sonos = require('./sonos');
const TpLinkPlug = require('./tp_link_plug')
const fliclib = require("./flic/clientlib/nodejs/fliclibNodeJs");
const FlicClient = fliclib.FlicClient;
const FlicConnectionChannel = fliclib.FlicConnectionChannel;
const FlicScanner = fliclib.FlicScanner;
const moment = require('moment');

let lifxLight;
let lampPlug;
let sonos;

const log = message => {
  const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a')
  console.log(`[${timestamp}]: ${message}`);
}

const initFlic = () => {
  var flicClient = new FlicClient("localhost", 5551);

  const listenToButton = bdAddr => {
    var cc = new FlicConnectionChannel(bdAddr);
    flicClient.addConnectionChannel(cc);

    cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
      log("Received click")
      log(clickType)

      if (clickType === 'ButtonSingleClick') {
        lifxLight.getState((error, state) => {
          if (state.power === 1) {
            lifxLight.off(300);
            lampPlug.setPowerState(false);
          } else {
            lifxLight.color(state.color.hue, state.color.saturation, 50, 3500, 0); // Fading the light on over two seconds
            lifxLight.on(300);
            lampPlug.setPowerState(true);
          }
        });
      } else if (clickType === 'ButtonDoubleClick') {
        sonos.play('spotify:playlist:1Ak4uuTgaNddv11reyPBX3')
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
  log("Starting main process")

  lampPlug = await TpLinkPlug.loadPlug('Lamp plug')
  lifxLight = await Lifx.loadLight('Nate')
  sonos = new Sonos('Bat Speaker')
  await sonos.loadSonos();

  log("Loaded all smart devices")

  initFlic();
}

main();

// Prevent the node process from exiting.
process.stdin.resume();
