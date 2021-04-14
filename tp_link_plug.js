const { Client } = require('tplink-smarthome-api');

const tpLinkClient = new Client();

const loadPlug = async (name) => {
  return (
    new Promise((resolve, reject) => {
      tpLinkClient.startDiscovery().on('device-new', (device) => {
        device.getSysInfo().then(info => {
          if (info.alias == name) {
            resolve(device);
          }
        });
      });
    })
  );
}

module.exports = { loadPlug };
