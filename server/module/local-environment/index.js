module.exports = function(sensors) {
  var inUse = false;
  var display = sensors.display;
  var autorefresh;

  var screenBuffer = [];

  /* stores screen color */
  var screenColor = {
    'red': 50,
    'green': 50,
    'blue': 50
  };

  var use = function() {
    refresh();
    autorefresh = setInterval(refresh, 5000);
  }

  /*  */
  var getDisplay = function() {
    return {
      'screenColor': screenColor,
      'screenBuffer': screenBuffer
    }
  }

  var destroy = function() {
    clearInterval(autorefresh);
  };

  var refresh = function() {
    var temp = sensors.thermometer.value();
    var light = sensors.lightmeter.value();

    screenBuffer[0] = 'Temp:  ' + temp + 'C';
    screenBuffer[1] = 'Light: ' + light+ 'Lux';
  }

  return {
    'name': 'Local Environment',
    'use': use,
    'getDisplay': getDisplay,
    'destroy': destroy
  }
}
