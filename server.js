const LightController = require('./light_controller.js');
const express = require('express');
const app = express();

const lightController = new LightController();

app.post('/click/single_click', function (req, res) {
  lightController.processSingleClick();
  res.send();
})

app.post('/click/double_click', function (req, res) {
  lightController.processDoubleClick();
  res.send()
})

app.post('/click/hold', function (req, res) {
  lightController.processHold();
  res.send()
})

const startServer = async () => {
  await lightController.loadDevices();

  app.listen(3000, () => {
    console.log(`Example app listening on port ${3000}!`)
  });
};

startServer();
