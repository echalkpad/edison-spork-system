var rtpi = require('../../services/rtpi/rtpi.js');

module.exports = function(sensors, mqttClient) {
  var autorefresh;
  var screenbuffer = [];

  /* stores screen color */
  var screencolor = {
    'red': 50,
    'green': 50,
    'blue': 50
  };

  var notificationled = false;

  /* Called when module gets loaded */
  var load = function() {
    screenbuffer[0] = "REAL TIME BUS";
    screenbuffer[1] = "INFORMATION";

    refresh(241861);
    autorefresh = setInterval(refresh, 10000, 241861);

    mqttClient.subscribe('bus-monitor');
    mqttClient.on('message', function(topic, message) {
      console.log(topic + " -- " + message);
    })
  }

  /* Called when module gets unloaded */
  var destroy = function() {
    clearInterval(autorefresh);
  }

  var refresh = function(stopid) {
    rtpi.getRealTimeData(stopid, '', 2, '', function(res) {
      var duetime;
      if (res[0]) {
        if (res[0].duetime < 10 || res[0].duetime == "due") {
          notificationled = true;
          screencolor.red = 0;
          screencolor.green = 200;
          screencolor.blue = 20;
        } else {
          notificationled = false;
          resetScreenColor();
        }

        for (var i = 0; (i < res.length) && (i < 2); i++) {
          screenbuffer[i] = res[i].route + ' ' + res[i].destination;
          res[i].duetime < 10  || res[i].duetime == 'due' ? duetime = ' ' + res[i].duetime : duetime = res[i].duetime;
          screenbuffer[i] = screenbuffer[i].substring(0, 10) + ' ' + duetime;
          mqttClient.publish('bus-monitor',res[i].route + ',' + duetime);
          if (duetime != 'due') {
            screenbuffer[i] += 'min';
          }
        }

      } else {
        screenbuffer[0] = "Real-time data";
        screenbuffer[1] = "unavailable";
        screencolor.red = 200;
        screencolor.green = 0;
        screencolor.blue = 0;
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

  var resetScreenColor = function() {
    screencolor.red = 50;
    screencolor.green = 50;
    screencolor.blue = 50;
  }

  return {
    'name': 'Bus monitor',
    'load': load,
    'destroy': destroy,
    'getDisplay': getDisplay
  }
}
