var http = require('https');
var querystring = require('querystring');
var url = require('url');
var config = require('./config');

module.exports.operators = operators;
module.exports.getStopInfo = getStopInfo;
module.exports.getRouteInfo = getRouteInfo;
module.exports.getRealTimeData = getRealTimeData;
/*
module.exports.getTimetableByDate = getTimetableByDate;
module.exports.getFullTimetable = getFullTimetable;
*/

/* List of different route operators */
const operators = {
  BUS_EIREANN: "BE",
  DUBLIN_BUS: "bac"
// Luas and Irish Rail not included because I can't test them
//  LUAS: "luas",
//  IRISH_RAIL: "ir"
}

/**
 * Fetches information about a specific stop
 * @param {string} stopid - ID of the stop
 * @param {string} stopname - Name or partial name of the stop
 * @param {string} operator - ID of the route operator
 * @param {callAPICallback} callback - The callback handling the response
 */
function getStopInfo(stopid, stopname, operator, callback) {
  (typeof stopid == 'string') || (stopid = stopid.toString()); // necessary?
  callAPI(config.BUSSTOP_INFO_PATH, {stopid: stopid, stopname: stopname, operator: operator}, callback);
}

/**
 * Fetches information about a specific bus route
 * @param {string} routeid - ID of the route
 * @param {string} operator - ID of the route operator
 * @param {callAPICallback} callback - The callback handling the response
 */
function getRouteInfo(routeid, operator, callback) {
  callAPI(config.ROUTE_INFO_PATH, {routeid: routeid, operator: operator}, callback);
}

/**
 * Fetches real time data about buses ETA
 * @param {string} stopid - ID of the bus stop
 * @param {string} routeid - ID of the route
 * @param {string} maxresults - maximum number of results
 * @param {string} operator - ID of the route operator
 * @param {callAPICallback} callback - The callback handling the response
 */
function getRealTimeData(stopid, routeid, maxresults, operator, callback) {
  callAPI(config.REALTIME_INFO_PATH, {stopid: stopid, routeid: routeid, maxresults: maxresults, operator: operator}, callback);
}

/**
 * Formats a valid URL from path and query
 * and makes a GET Request to that URL
 * @param {string} path - Route we want to call within the API
 * @param {Object} query - Parameters to pass in the URL
 * @param {callAPICallback} callback - The callback handling the response
 */
function callAPI(path, query, callback) {
  // format URL and adds parameters to it
  var fullURL = url.format({
    protocol: 'https',
    hostname: config.BASE_URL,
    pathname: path,
    query: query
  });

  // Make HTTP GET Request
  http.get(fullURL, function(res) {
    var output = '';

    // Async concatenation of data
    res.on('data', function(chunk) {
      output += chunk;
    });

    // On end event, execute callback
    res.on('end', function () {
      console.log(JSON.parse(output));
      callback(JSON.parse(output).results);
    });
  });
}

/**
 * @callback callAPICallback
 * @param {Object[]} res - Response from the API
 */
