/* eslint-disable no-unused-vars */

//  const API_URL = 'http://cameranamnguyentch.ddns.net'; //  platform server
const API_URL = 'http://127.0.0.1';

// Only developing application connect to local ip ,another applications connect to developement server ip.
const config = {
  API_URL: `${API_URL}:81/api/appsuckhoe`,
}

export default config
