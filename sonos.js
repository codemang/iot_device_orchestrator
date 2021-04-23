const { DeviceDiscovery } = require('sonos')

class Sonos {
  constructor(sonosName) {
    this.sonosName = sonosName;
    this.sonosRef = null;
  }

  async loadSonos() {
    return new Promise((resolve, reject) => {
        DeviceDiscovery(async (device) => {
          const deviceGroups = await device.getAllGroups();
          const deviceName = deviceGroups[0].Name

          if (deviceName === this.sonosName) {
            this.sonosRef = device;
            resolve();
          }
        })
      })
  }

  async play(uri) {
    this.sonosRef.play(uri)
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

const main = async () => {
  const sonos = new Sonos('Bat Speaker')
  await sonos.loadSonos();
  sonos.play('spotify:playlist:1Ak4uuTgaNddv11reyPBX3')
}

module.exports = Sonos;

// const main = async () => {
// // event on all found...
// DeviceDiscovery(async (device) => {
//   console.log('found device at ')
//   // console.log(device);
//   console.log(res[0].Name);
// })
// }
//
// main();
//
// process.stdin.resume();
