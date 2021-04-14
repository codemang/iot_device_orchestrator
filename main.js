const Lifx = require('./lifx');

let light;
Lifx.loadLight('Nate', _light => light = _light);

setTimeout(() => {
  Lifx.togglePower(light);
}, 3000);


process.stdin.resume();
