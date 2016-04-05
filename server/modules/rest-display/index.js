var express = require('express');
var bodyparser = require('body-parser');
var router = express.Router();
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }));

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
  router.post('/led/:val', function(req, res) {
    if (req.params.val == 1) {
      notificationled = true;
    } else notificationled = false;
    res.status(200).send();
  });

  router.get('/led', function(req, res) {
    res.status(200).send(notificationled === true ? 1 : 0);
  });

  router.post('/display', function(req, res) {
    console.log(req.body);
    screenbuffer[0] = req.data.display0;
    screenbuffer[1] = req.data.display1;
    screencolor.red = (req.data.color.red === undefined ? 50 : screencolor.red);
    screencolor.green = (req.data.color.green === undefined ? 50 : screencolor.green);
    screencolor.blue = (req.data.color.blue === undefined ? 50 : screencolor.blue);
  });

  /**
   * copies and return display parameters (screen color, text, notification led on/off)
   * @returns {object} - display parameters
   */
  var getDisplay = function() {
    console.log(notificationled);
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
    'destroy': destroy,
    'router': router
  }
}
