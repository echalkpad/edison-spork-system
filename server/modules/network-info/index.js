var os = require('os');

module.exports = function(sensors) {
  var autorefresh;
  var screenbuffer = [];

  /* stores screen color */
  var screencolor = {
    'red': 50,
    'green': 50,
    'blue': 50
  };

  var notificationled = false;

  var load = function() {
    refresh();
    autorefresh = setInterval(refresh, 10000);
  }

  /**
   * copies and return display parameters (screen color, text, notification led on/off)
   * @returns {object} - display parameters
   */
  var getDisplay = function() {
    return {
      'screencolor': {red: screencolor.red, green: screencolor.green, blue: screencolor.blue },
      'screenbuffer': [screenbuffer[0], screenbuffer[1]],
      'notificationled': notificationled
    }
  }

  var destroy = function() {
    clearInterval(autorefresh);
  };

  var refresh = function() {
    var networkInfo = os.networkInterfaces();
    if (!networkInfo.wlan0) {
      screencolor.red = 100;
      screencolor.green = 0;
      screencolor.blue = 0;
      screenbuffer[0] = "No network connection";
    } else {
      resetScreenColor();
      screenbuffer[0] = "IP: " + networkInfo.wlan0[0].address;
    }
  }

  var resetScreenColor = function() {
    screencolor.red = 50;
    screencolor.green = 50;
    screencolor.blue = 50;
  }

  return {
    'name': 'Network Info',
    'load': load,
    'getDisplay': getDisplay,
    'destroy': destroy
  }
}
