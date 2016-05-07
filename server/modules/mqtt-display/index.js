module.exports = function(sensors, mqttClient) {

  /* Contains line 1 and 2 to display on screen */
  var screenbuffer = [];

  /* stores screen color */
  var screencolor = {
    'red': 50,
    'green': 50,
    'blue': 50
  };

  /* If true, will light up the led */
  var notificationled = false;

  /**
   * Executed at the start of the app
   */
  var load = function() {
    screenbuffer[0] = "MQTT Light";
    mqttClient.subscribe('led');
    mqttClient.subscribe('display');
    mqttClient.on('message', function(topic, message) {
      if (topic === 'led') {
        message.toString('ascii') === 'on' ? notificationled = true : notificationled = false;
      } else if (topic === 'display') {
        screenbuffer[0] = message.toString('ascii');
      }
    });
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

  /**
   * copies and return display parameters (screen color, text, notification led on/off)
   * @returns {object} - display parameters
   */
  var destroy = function() {
    clearInterval(autorefresh);
  };

  var refresh = function() {}

  return {
    'name': 'Module Name',
    'load': load,
    'getDisplay': getDisplay,
    'destroy': destroy
  }
}
