const request = require('request-promise-native');

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

/* 
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`)

};
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
//module.exports = { fetchMyIP };


//Input: None
//Returns: Promise for fly over data for users location

const nextISSTimesForMyLocation = function() {
 return fetchMyIP()
   .then(fetchCoordsByIP)
   .then(fetchISSFlyOverTimes)
   .then((data) => {
     const { response } = JSON.parse(data);
     return response;
   });
};

module.exports = { nextISSTimesForMyLocation };