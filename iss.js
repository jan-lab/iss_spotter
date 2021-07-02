//API Call #1: Fetch IP Address
//Define a function fetchMyIP which will asynchronously return our IP Address using an API.

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const api = `https://api.ipify.org/?format=json`;
 
  request(api, (error, response, body) => { //this is an async function
    
    // inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.
    if (error) return callback(error, null);
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
      //console.log(Error(msg))
    }

    // if we get here, all's well and we got the data
    const ip = JSON.parse(body).ip;
    //console.log(typeof ip) //string
    callback(null, ip);
    //console.log(data.ip); //64.46.1.237
  });
};
//fetchMyIP()

const fetchCoordsByIP = function(ip, callback) {
  
  const api = `https://freegeoip.app/json/${ip}`;

  request(api, (error, response, body) => { //this is an async function
    
    //inside the request callback ...
    if (error) return callback(error, null); // error can be set if invalid domain, user is offline, etc.
    
    if (response.statusCode !== 200) { // if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const {latitude, longitude} = JSON.parse(body);

    callback(null, {latitude, longitude});
    
    // const obj = JSON.parse(body);
    // let coords = {};
    // for (const [key, value] of Object.entries(obj)) {
    //   if (key === 'latitude' || key === 'longitude') {
    //     coords[key] = value;
    //   }
    // }
    //console.log(coords);
    //callback(null, coords);

  });
};
// //fetchCoordsByIP('64.46.1.237');


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  //const api = `http://api.open-notify.org/is%7Bc=${coords.latitude}&lon=${coords.longitude}oords.longitude%7D`; //to chek with invalid link
  const api = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  request(api, (error, response, body) => { //this is an async function
  //console.log(body);
  //inside the request callback ...
    if (error) return callback(error, null); // error can be set if invalid domain, user is offline, etc.
    
    if (response.statusCode !== 200) { // if non-200 status, assume server error
      const msg = `Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      callback(Error(msg), null);
      //console.log(JSON.parse(body).message); //not working
      return;
    }

    const flyOverTimes = JSON.parse(body).response;
    callback(null, flyOverTimes);
    //console.log(flyOverTimes);

  });
};
//fetchISSFlyOverTimes({ latitude: 49.2765, longitude: -123.1247 });

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

// Only export nextISSTimesForMyLocation and not the other three (API request) functions.
// This is because they are not needed by external modules.
module.exports = { nextISSTimesForMyLocation };


// module.exports = {
//   fetchMyIP,
//   fetchCoordsByIP,
//   fetchISSFlyOverTimes,
//   nextISSTimesForMyLocation
// };