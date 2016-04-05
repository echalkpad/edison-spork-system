var express = require('express');
var router = express.Router();

module.exports = function(sensors) {
  var screenbuffer = [];

  /* stores screen color */
  var screencolor = {
    'red': 50,
    'green': 50,
    'blue': 50
  };

  var notificationled = false;

  var load = function() {}

  // Mini REST Api
  router.get('/api/led/:val', function(req, res) {
    console.log(req.params);
    res.status(200).send();
  })

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
