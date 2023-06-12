const { ethers } = require('ethers');
const {default: axios} = require("axios");
const fs = require('fs');
require('dotenv').config();


const API_URL = 'https://dev.wallet.zelus.io' // prod, this can be changed to dev.wallet.zelus.io or staging.wallet.zelus.io, but will require an actual zelus wallet account for email verification
const WALLET_PRIVATE_KEY = process.env.PRIVATE_KEY  // YOU ARE RESPONSIBLE FOR CREATING THIS AND KEEPING IT SAFE - should be the private key to an Ethereum wallet

const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY);

/** Make sure that the necessary environment variables are there */
function checkEnvironment() {
    if (!WALLET_PRIVATE_KEY) throw new Error(`Missing private key: make sure to run 'npm run register' first!`);
}

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


async function buildRequest(timestamp) {

    const signature = await wallet.signMessage(timestamp);

    return {
        ethereum_address: wallet.address.toLowerCase(),
        timestamp: timestamp,
        signature: signature
    }
}

async function main() {

    checkEnvironment();
    console.log(`[INFO] environment check passed`)

    // get the timestamp to sign
    const timestamp = await getCurrentTime();
    console.log(`[INFO] got server time from API: ${timestamp}`)

    // build the request
    const request = await buildRequest(timestamp);
    console.log(`[INFO] built request data: ${JSON.stringify(request)}`)

    try {
        console.log(`API url: `, API_URL)
        const loginResponse = await axios.post(`${API_URL}/auth/login`, request);
        console.log(`[INFO] got status code ${loginResponse.status} from the request`);
        if(loginResponse.data.token) {
            console.log(`[INFO] Got token from login request: ${loginResponse.data.token}`)
            fs.writeFileSync('./token.txt', loginResponse.data.token)
            console.log(`Wrote token to token.txt`)
        }
    }
    catch (err) {
        console.log(`[ERROR]: ${err.message}`)
    }
}

/** Launch the code if this is run as the main module */
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(`[ERROR] ${err.message}`);
            console.error(err);
            process.exit(1);
        })
}
