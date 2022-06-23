const LifxLight = require('./devices/lifx_light');
const TpLinkPlug = require('./devices/tp_link_plug')

const SINGLE_CLICK = 'single_click';
const DOUBLE_CLICK = 'double_click';
const HOLD = 'hold';

class IotDeviceOrchestrator {
  constructor() {
    this.lampPlug = undefined;
    this.lifxLight = undefined;
    this.currentMode = SINGLE_CLICK;
  }

  async loadDevices() {
    this.lampPlug = await TpLinkPlug.loadPlug('Nate Light')
    this.lifxLight = await LifxLight.load('Nate')
  }

  async processSingleClick() {
    if (this.currentMode !== SINGLE_CLICK) {
      this.cleanupBeforeModeSwitch();
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
    if (this.currentMode !== DOUBLE_CLICK) {
      this.cleanupBeforeModeSwitch();
    }

    const lifxLightState = await this.lifxLight.getLightState();

    if (this.currentMode !== DOUBLE_CLICK || lifxLightState.power === 0) {
      this.lifxLight.turnOn([293, 100, 50, 3500]);
      this.lampPlug.setPowerState(false);
    } else {
      this.lifxLight.turnOff();
      this.lampPlug.setPowerState(false);
    }

    this.currentMode = DOUBLE_CLICK;
  }

  async processHold() {
    if (this.currentMode !== HOLD) {
      this.cleanupBeforeModeSwitch();
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

  async cleanupBeforeModeSwitch() {}
}
module.exports = IotDeviceOrchestrator;
