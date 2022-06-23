const { Client } = require('tplink-smarthome-api');

class TpLinkPlug {
  constructor(plugName) {
    this.plugName = plugName;
    this.plugRef = undefined;
    this.tpLinkClient = new Client();
  }

  static async load(plugName) {
    const plug = new this(plugName);
    await plug.loadPlug();
    return plug;
  }

  async loadPlug() {
    return (
      new Promise((resolve) => {
        this.tpLinkClient.startDiscovery().on('device-new', (device) => {
          device.getSysInfo().then((info) => {
            if (info.alias === this.plugName) {
              this.plugRef = device;
              resolve();
            }
          });
        });
      })
    );
  }

  setPowerState(isPowerOn) {
    this.plugRef.setPowerState(isPowerOn);
  }
}

module.exports = TpLinkPlug;
