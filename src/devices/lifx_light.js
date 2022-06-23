const LifxClient = require('node-lifx').Client;

class LifxLight {
  constructor(lightName) {
    this.lightName = lightName;
    this.lightRef = null;
    this.lifxApiClient = new LifxClient();
    this.lifxApiClient.init();
  }

  static async load(lightName) {
    const light = new this(lightName);
    await light.loadLight();
    return light;
  }

  async loadLight() {
    return (
      new Promise((resolve) => {
        this.lifxApiClient.on('light-new', (light) => {
          light.getState((error, state) => {
            if (state.label === this.lightName) {
              this.lightRef = light;
              resolve();
            }
          });
        });
      })
    );
  }

  async getLightState() {
    return new Promise((resolve) => {
      this.lightRef.getState((error, state) => {
        resolve(state);
      });
    });
  }

  async isLightOn() {
    const lightState = await this.getLightState();
    return lightState.power === 1;
  }

  async turnOn(color = [90, 0, 50, 2750]) {
    this.lightRef.color(...color);
    this.lightRef.on(300); // Fade the light on over a period of milliseconds.
  }

  async turnOff() {
    this.lightRef.off(300); // Fade the light on over a period of milliseconds.
  }
}

module.exports = LifxLight;
