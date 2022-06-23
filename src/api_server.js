const IotDeviceOrchestrator = require('./iot_device_orchestrator.js');
const express = require('express');
const cors = require('cors');

const app = express();

const iotDeviceOrchestrator = new IotDeviceOrchestrator();

app.post('/click/single_click', cors(), function (req, res) {
  iotDeviceOrchestrator.processSingleClick();
  res.send();
})

app.post('/click/double_click', function (req, res) {
  iotDeviceOrchestrator.processDoubleClick();
  res.send()
})

app.post('/click/hold', function (req, res) {
  iotDeviceOrchestrator.processHold();
  res.send()
})

const startServer = async () => {
  await iotDeviceOrchestrator.loadDevices();

  app.listen(4000, () => {
    console.log(`Example app listening on port ${4000}!`)
  });
};

startServer();
