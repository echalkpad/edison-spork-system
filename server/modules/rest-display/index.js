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
    screenbuffer[0] = req.body.display0;
    screenbuffer[1] = req.body.display1;
    screencolor.red = (req.body['color.red'] ? 50 : parseInt(screencolor.red));
    screencolor.green = (req.body['color.green'] ? 50 : parseInt(screencolor.green));
    screencolor.blue = (req.body['color.blue'] ? 50 : parseInt(screencolor.blue));
    res.status(200).send();
  });

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
    'destroy': destroy,
    'router': router
  }
}
