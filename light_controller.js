
const LifxLight = require('./lifx_light');
const Sonos = require('./sonos');
const TpLinkPlug = require('./tp_link_plug')

const SINGLE_CLICK = 'single_click';
const DOUBLE_CLICK = 'double_click';
const HOLD = 'hold';

class LightController {
  constructor() {
    this.currentMode = SINGLE_CLICK;
    this.lampPlug = undefined;
    this.lifxLight = undefined;
    this.sonos = undefined;
  }

  async loadDevices() {
    return Promise.resolve();

    this.lampPlug = await TpLinkPlug.loadPlug('Lamp plug')

    this.lifxLight = new LifxLight('Nate')
    await this.lifxLight.load();

    this.sonos = new Sonos('Bat Speaker')
    await this.sonos.loadSonos();
  }

  async processSingleClick() {
    console.log("Single Click");
    return;

    if (this.currentMode !== SINGLE_CLICK) {
      cleanupBeforeModeSwitch();
    }

    const lifxLightState = await this.lifxLight.getLightState();

    if (this.currentMode !== SINGLE_CLICK || lifxLightState.power === 0) {
      this.lifxLight.turnOn();
      this.lampPlug.setPowerState(true);
    } else {
      this.lifxLight.turnOff();
      this.lampPlug.setPowerState(false);
    }

    this.currentMode = SINGLE_CLICK;
  }

  async processDoubleClick() {
    console.log("Double Click");
    return;

    if (this.currentMode !== DOUBLE_CLICK) {
      cleanupBeforeModeSwitch();
    }

    const lifxLightState = await this.lifxLight.getLightState();

    if (this.currentMode !== DOUBLE_CLICK || lifxLightState.power === 0) {
      this.lifxLight.turnOn([293, 100, 50, 3500]);
      this.lampPlug.setPowerState(false);
      this.sonos.setVolume(9)
      this.sonos.play('spotify:playlist:1Ak4uuTgaNddv11reyPBX3')
    } else {
      this.lifxLight.turnOff();
      this.lampPlug.setPowerState(false);
      this.sonos.pause();
    }

    this.currentMode = DOUBLE_CLICK;
  }

  async processHold() {
    console.log("Hold");
    return;

    if (this.currentMode !== HOLD) {
      cleanupBeforeModeSwitch();
    }

    const lifxLightState = await this.lifxLight.getLightState();

    const lampState = await this.lampPlug.getSysInfo()

    if (this.currentMode !== HOLD || lampState.relay_state === 0) {
      this.lifxLight.turnOff();
      this.lampPlug.setPowerState(true);
    } else {
      this.lampPlug.setPowerState(false);
    }

    this.currentMode = HOLD;
  }

  async cleanupBeforeModeSwitch() {
    if (this.currentMode === DOUBLE_CLICK) {
      this.sonos.pause();
    }
  }
}
module.exports = LightController;
