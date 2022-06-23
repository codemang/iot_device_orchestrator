const { DeviceDiscovery } = require('sonos');

class Sonos {
  constructor(sonosName) {
    this.sonosName = sonosName;
    this.sonosRef = null;
  }

  async loadSonos() {
    return new Promise((resolve) => {
      DeviceDiscovery(async (device) => {
        const deviceGroups = await device.getAllGroups();
        const deviceName = deviceGroups[0].Name;

        if (deviceName === this.sonosName) {
          this.sonosRef = device;
          resolve();
        }
      });
    });
  }

  async play(uri) {
    this.sonosRef.play(uri);
  }

  async getVolume() {
    return this.sonosRef.getVolume();
  }

  setVolume(volume) {
    this.sonosRef.setVolume(volume);
  }

  pause() {
    this.sonosRef.pause();
  }
}

module.exports = Sonos;
