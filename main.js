const LifxLight = require('./lifx_light');
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

const processSingleClick = async () => {
  const lifxLightState = await lifxLight.getLightState();

  if (lifxLightState.power === 1) {
    lifxLight.turnOff();
    lampPlug.setPowerState(false);
  } else {
    lifxLight.turnOn();
    lampPlug.setPowerState(true);
  }
};

const initFlic = () => {
  var flicClient = new FlicClient("localhost", 5551);

  const listenToButton = bdAddr => {
    var cc = new FlicConnectionChannel(bdAddr);
    flicClient.addConnectionChannel(cc);

    cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
      log("Received click")
      log(clickType)

      if (clickType === 'ButtonSingleClick') {
        processSingleClick();
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

  lifxLight = new LifxLight('Nate')
  await lifxLight.load();

  sonos = new Sonos('Bat Speaker')
  await sonos.loadSonos();

  log("Loaded all smart devices")

  initFlic();
}

main();

// Prevent the node process from exiting.
process.stdin.resume();
