const LifxLight = require('./lifx_light');
const Sonos = require('./sonos');
const TpLinkPlug = require('./tp_link_plug')
const fliclib = require("./flic/clientlib/nodejs/fliclibNodeJs");
const FlicClient = fliclib.FlicClient;
const FlicConnectionChannel = fliclib.FlicConnectionChannel;
const FlicScanner = fliclib.FlicScanner;
const moment = require('moment-timezone');
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


let lifxLight;
let lampPlug;
let sonos;

const SINGLE_CLICK = 'single_click';
const DOUBLE_CLICK = 'double_click';
const HOLD = 'hold';

let currentMode = SINGLE_CLICK;

const log = message => {
  const timestamp = moment().tz('America/New_York').format('MMMM Do YYYY, h:mm:ss a')
  console.log(`[${timestamp}]: ${message}`);
}

const cleanupBeforeModeSwitch = () => {
  if (currentMode === DOUBLE_CLICK) {
    sonos.pause();
  }
}

const processSingleClick = async () => {
  if (currentMode !== SINGLE_CLICK) {
    cleanupBeforeModeSwitch();
  }

  const lifxLightState = await lifxLight.getLightState();

  if (currentMode !== SINGLE_CLICK || lifxLightState.power === 0) {
    lifxLight.turnOn();
    lampPlug.setPowerState(true);
  } else {
    lifxLight.turnOff();
    lampPlug.setPowerState(false);
  }

  currentMode = SINGLE_CLICK
};

const processDoubleClick = async () => {
  if (currentMode !== DOUBLE_CLICK) {
    cleanupBeforeModeSwitch();
  }

  const lifxLightState = await lifxLight.getLightState();

  if (currentMode !== DOUBLE_CLICK || lifxLightState.power === 0) {
    lifxLight.turnOn([293, 100, 50, 3500]);
    lampPlug.setPowerState(false);
    sonos.setVolume(9)
    sonos.play('spotify:playlist:1Ak4uuTgaNddv11reyPBX3')
  } else {
    lifxLight.turnOff();
    lampPlug.setPowerState(false);
    sonos.pause();
  }

  currentMode = DOUBLE_CLICK;
}

const processHold = async () => {
  if (currentMode !== HOLD) {
    cleanupBeforeModeSwitch();
  }

  const lifxLightState = await lifxLight.getLightState();

  const lampState = await lampPlug.getSysInfo()

  if (currentMode !== HOLD || lampState.relay_state === 0) {
    lifxLight.turnOff();
    lampPlug.setPowerState(true);
  } else {
    lampPlug.setPowerState(false);
  }

  currentMode = HOLD;
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
        processSingleClick();
      } else if (clickType === 'ButtonDoubleClick') {
        processDoubleClick();
      } else if (clickType === 'ButtonHold') {
        processHold();
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

const initDevices = async () => {
  lampPlug = await TpLinkPlug.loadPlug('Lamp plug')

  lifxLight = new LifxLight('Nate')
  await lifxLight.load();

  sonos = new Sonos('Bat Speaker')
  await sonos.loadSonos();
}

const main = async () => {
  log("Starting main process")

  await initDevices();
  log("Loaded all smart devices")

  initFlic();
}

const test = async () => {
  log("Starting main process")

  await initDevices();
  log("Loaded all smart devices")


  process.stdin.on('keypress', (str, key) => {
    if (str === 'a') {
      processSingleClick();
      console.log('')
    } else if (str === 's') {
      processDoubleClick();
      console.log('')
    } else if (str === 'd') {
      processHold();
      console.log('')
    } else if (str === 'q') {
      process.exit();
    }
  })
}

main();
// test();

// Prevent the node process from exiting.
process.stdin.resume();
