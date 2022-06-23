const LifxLight = require('./devices/lifx_light.js');
const TpLinkPlug = require('./devices/tp_link_plug.js');
const LightController = require('./light_controller.js');

console.log("Starting")

const togglePower = async () => {
  const light = new LifxLight('Nate');
  await light.loadLight();
  console.log("111")

  if (await light.isLightOn()) {
    console.log("Turning off")
    await light.turnOff();
  } else {
    console.log("Turning on")
    await light.turnOn();
  }

  console.log("Done");

  setTimeout(() => {
    togglePower();
  }, 4000);

};

const readPlug = async () => {
  const plug = await TpLinkPlug.load('Nate Light');
  plug.setPowerState(true);
}

const readPower = async () => {
  const light = await LifxLight.load('Nate');
  console.log(await light.getLightState());
}

const loadLightController = async () => {
  console.log("Starting");
  const controller = new LightController();
  await controller.loadDevices();
  console.log("Done");
}

// loadLightController();
// togglePower();
// readPower();
readPlug();

process.stdin.resume();
// color: { hue: 293, saturation: 100, brightness: 50, kelvin: 3500 },
