var EventEmitter = require('events').EventEmitter;
var lcd = require('jsupm_i2clcd');
var groveLib = require('jsupm_grove');

/* Load sensors */
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
var temp = new groveLib.GroveTemp(0);
var light = new groveLib.GroveLight(3);
var button = new groveLib.GroveButton(2);
var led = new groveLib.GroveLed(5);

/* List of sensors exposed to external modules */
var sensors = {
  'display': display,
  'thermometer': temp,
  'lightmeter': light,
  'led': led
}

/* Modules registered here */
var modules = [
  require('./server/module/bus-monitor/index.js')(sensors),
  require('./server/module/local-environment/index.js')(sensors)
];

var currentModule = 0;
var previousButtonState = 0;
var mainEventEmitter = new EventEmitter();

var eventLoop = function() {
  // modules[currentModule].listen(); // Call current module's event emitter
  if (button.value() == 1 && previousButtonState != 1) {
    mainEventEmitter.emit('buttonPressed');
  }
  previousButtonState = button.value();
}

setInterval(eventLoop, 200);

mainEventEmitter.on('buttonPressed', nextModule);

modules[currentModule].use();

function nextModule() {
  modules[currentModule].destroy();
  currentModule++;
  if (currentModule == modules.length) {
    currentModule = 0;
  }
  modules[currentModule].use();
}

display.clear = function() {
  display.setCursor(0, 0);
  display.write('                ')
  display.setCursor(1, 0);
  display.write('                ')
  display.setCursor(0, 0);
}
