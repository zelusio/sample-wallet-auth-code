const { ethers } = require('ethers');
const {default: axios} = require("axios");
const API_URL = 'https://dev.zelus.io' // this can be changed to api.zelus.io if you want

/**
 * Get the server time of {@link API_URL}
 * @returns {Promise<string>} - the timestamp of the api server at {@link API_URL}
 */
async function getCurrentTime() {
    console.log(`[INFO] Retrieving time from api server`)
    const response = await axios.get(`${API_URL}/current-time`);
    if (!response.data.current_time) throw new Error(`Missing timestamp in response from API server! got the following: ${JSON.stringify(response.data)}`);
    console.log(`[INFO] got server time as ${response.data.current_time}`);
    return response.data.current_time
}

async function signData(data) {

}
