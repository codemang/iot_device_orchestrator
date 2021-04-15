const Lifx = require('./lifx');
const Sonos = require('./sonos');
const TpLinkPlug = require('./tp_link_plug')
const fliclib = require("./flic/clientlib/nodejs/fliclibNodeJs");
const FlicClient = fliclib.FlicClient;
const FlicConnectionChannel = fliclib.FlicConnectionChannel;
const FlicScanner = fliclib.FlicScanner;

let lifxLight;
let lampPlug;
let sonos;

const initFlic = () => {
  var flicClient = new FlicClient("localhost", 5551);

  const listenToButton = bdAddr => {
    var cc = new FlicConnectionChannel(bdAddr);
    flicClient.addConnectionChannel(cc);

    cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
      // if (clickType === 'ButtonUp') {
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
    console.log("Connected to daemon!");

    flicClient.getInfo(function(info) {
      info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
        listenToButton(bdAddr);
      });
    });
  });
}

const main = async () => {
  lampPlug = await TpLinkPlug.loadPlug('Lamp plug')
  lifxLight = await Lifx.loadLight('Nate')
  sonos = new Sonos('Bat Speaker')
  await sonos.loadSonos();

  initFlic();
}

main();

// Prevent the node process from exiting.
process.stdin.resume();
