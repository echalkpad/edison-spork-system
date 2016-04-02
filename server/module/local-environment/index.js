module.exports = function(sensors) {
  var inUse = false;
  var display = sensors.display;
  var autorefresh;

  var use = function() {
    display.clear();
    display.write('LOCAL ENV');
    display.setColor(50, 50, 50);
    refresh();
    autorefresh = setInterval(refresh, 5000);
  }

  var destroy = function() {
    clearInterval(autorefresh);
  };

  var refresh = function() {
    display.clear();
    display.setCursor(0, 0);
    display.write('Temp:  ' + sensors.thermometer.value() + 'C');
    display.setCursor(1, 0);
    display.write('Light: ' + sensors.lightmeter.value() + 'Lux');
  }

  return {
    'name': 'Local Environment',
    'use': use,
    'destroy': destroy
  }
}
