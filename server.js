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

/* Modules need to be registered here */
var modules = [
//  require('./server/module/bus-monitor/index.js')(sensors),
  require('./server/modules/local-environment/index.js')(sensors)
];

/* Stores Index of the current module in modules[] */
var currentModuleIndex = 0;
var previousButtonState = 0;
var mainEventEmitter = new EventEmitter();

/* Main loop
 * Checks state of button and raises event on press
 */
var eventLoop = function() {
  // modules[currentModuleIndex].listen(); // Call current module's event emitter
  if (button.value() == 1 && previousButtonState != 1) {
    mainEventEmitter.emit('buttonPressed');
  }
  previousButtonState = button.value();
}

setInterval(eventLoop, 200);
setInterval(refreshDisplay, 200);

mainEventEmitter.on('buttonPressed', nextModule);

modules[currentModuleIndex].load();

/* Cycles to the next module */
function nextModule() {
  currentModuleIndex++;
  if (currentModuleIndex == modules.length) {
    currentModuleIndex = 0;
  }
  modules[currentModuleIndex].load();
}

function refreshDisplay() {
  var screenParams = modules[currentModuleIndex].getDisplay();
  display.setCursor(0, 0);
  display.write(screenParams.screenbuffer[0]);
  display.setCursor(0, 1);
  display.write(screenParams.screenbuffer[1]);
}

display.clear = function() {
  display.setCursor(0, 0);
  display.write('                ')
  display.setCursor(1, 0);
  display.write('                ')
  display.setCursor(0, 0);
}