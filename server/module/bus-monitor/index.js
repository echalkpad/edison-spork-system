var rtpi = require('../../services/rtpi/rtpi.js');

module.exports = function(sensors) {
  var display = sensors.display;
  var autorefresh;
  var inUse = false;

  /* Called when module gets loaded */
  var use = function() {
    inUse = true;
    display.clear();
    display.write('BUS MONITOR');
    display.setColor(60, 60, 60);
    refresh(241861);
    autorefresh = setInterval(refresh, 10000, 241861);
  }

  /* Called when module gets unloaded */
  var destroy = function() {
    inUse = true;
    clearInterval(autorefresh);
    sensors.led.off();
  }

  var refresh = function(stopid) {
    rtpi.getRealTimeData(stopid, '', 2, '', function(res) {
      var duetime;
      if (inUse) {
        if (res[0].duetime < 10) {
          sensors.led.on();
          display.setColor(0, 200, 20);
        } else { sensors.led.off() }

        for (var i = 0; (i < res.length) && (i < 2); i++) {
          display.setCursor(i, 0);
          display.write('' + res[i].route + ' ' + res[i].destination);
          display.setCursor(i, 10);
          res[i].duetime < 10 ? duetime = ' ' + res[i].duetime : duetime = res[i].duetime;
          display.write(' ' + duetime + 'min');
        }
      }
    });
  }

  return {
    'name': 'Bus monitor',
    'use': use,
    'destroy': destroy
  }
}
