const LifxClient = require('node-lifx').Client;
const _ = require('lodash');

class LifxLight {
  constructor(lightName) {
    this.lightName = lightName;
    this.lightRef = null;
    this.lifxApiClient = new LifxClient();
    this.lifxApiClient.init();
  }

  async load() {
    return (
      new Promise((resolve, reject) => {
        this.lifxApiClient.on('light-new', light => {
          light.getState((error, state) => {
            if (state.label === this.lightName) {
              this.lightRef = light;
              resolve();
            }
          })
        });
      })
    );
  }

  async getLightState() {
    return new Promise((resolve, reject) => {
      this.lightRef.getState((error, state) => {
        resolve(state);
      });
    });
  }

  async isLightOn() {
    const lightState = await this.getLightState();
    return lightState.power === 1;
  }

  async turnOn() {
    this.lightRef.color(90, 0, 79, 2750);
    this.lightRef.on(300); // Fade the light on over a period of milliseconds.
  }

  async turnOff() {
    this.lightRef.off(300); // Fade the light on over a period of milliseconds.
  }
};

module.exports = LifxLight;
