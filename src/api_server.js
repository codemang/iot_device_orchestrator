const express = require('express');
const cors = require('cors');
const IotDeviceOrchestrator = require('./iot_device_orchestrator');

const app = express();

const iotDeviceOrchestrator = new IotDeviceOrchestrator();

app.post('/click/single_click', cors(), (req, res) => {
  iotDeviceOrchestrator.processSingleClick();
  res.send();
});

app.post('/click/double_click', (req, res) => {
  iotDeviceOrchestrator.processDoubleClick();
  res.send();
});

app.post('/click/hold', (req, res) => {
  iotDeviceOrchestrator.processHold();
  res.send();
});

const startServer = async () => {
  await iotDeviceOrchestrator.loadDevices();

  app.listen(4000, () => {
    console.log(`Example app listening on port ${4000}!`); // eslint-disable-line no-console
  });
};

startServer();
