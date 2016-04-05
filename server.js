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
  'thermometer': temp,
  'lightmeter': light,
}

/* Modules need to be registered here */
var modules = [
  require('./server/module/bus-monitor/index.js')(sensors),
  require('./server/modules/local-environment/index.js')(sensors),
  require('./server/modules/network-info/index.js')(sensors)
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
setInterval(refreshDisplay, 1000);

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
  display.clear();
  var screenParams = modules[currentModuleIndex].getDisplay();
  display.setColor(screenParams.screencolor.red, screenParams.screencolor.green, screenParams.screencolor.blue);
  // Should put this in a loop!
  display.setCursor(0, 0);
  if (screenParams.screenbuffer[0]) {
    display.write(screenParams.screenbuffer[0]);
  }
  display.setCursor(1, 0);
  if (screenParams.screenbuffer[1]) {
    display.write(screenParams.screenbuffer[1]);
  }
}

display.clear = function() {
  display.setCursor(0, 0);
  display.write('                ');
  display.setCursor(1, 0);
  display.write('                ');
  display.setCursor(0, 0);
}
