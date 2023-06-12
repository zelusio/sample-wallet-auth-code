const { ethers } = require('ethers');
const axios = require('axios').default;
const fs = require('fs');
require('dotenv').config()

const EMAIL = 'someemail4+noverify@somedomain.com' // "+noverify" is a special flag that will bypass email verification on DEV
const API_URL = 'https://dev.wallet.zelus.io' // this can be changed to staging.wallet.zelus.io or prod.wallet.zelus.io, but will require an actual zelus wallet account for email verification


async function getCurrentTime() {
    console.log(`[INFO] Retrieving time from api server`)
    const response = await axios.get(`${API_URL}/current-time`);
    if (!response.data.current_time) throw new Error(`Missing timestamp in response from API server! got the following: ${JSON.stringify(response.data)}`);
    console.log(`[INFO] got server time as ${response.data.current_time}`);
    return response.data.current_time.toString()
}

/** Asynchronous entrypoint function */
async function main() {
    console.log(`[INFO] Registering an account with the dev backend. This will save wallet information to a local .env file.`);

    // create a random wallet
    const wallet = ethers.Wallet.createRandom()

    // register the wallet with a sample, random email

    // build and send the request
    const timestamp = await getCurrentTime()
    const requestBody = {
        email: EMAIL,
        ethereum_address: wallet.address,
        imported: false,
        timestamp: timestamp,
        signature: await wallet.signMessage(timestamp)
    }
    const registrationResponse = await axios.post(`${API_URL}/auth/register`, requestBody);
    if (registrationResponse.status !== 201) throw new Error(`Received non-201 status from backend: ${registrationResponse.status}`);
    console.log(`[INFO] registration complete!`);
    console.log(`[INFO] account information: `);
    console.log(`\tAddress: ${wallet.address}`);
    console.log(`\tEmail: ${EMAIL}`);
    console.log(`\tGUID: ${registrationResponse.data.guid}`)
    console.log(`\tToken (good for 15 minutes): ${registrationResponse.data.token}`)

    // write out data to env
    fs.writeFileSync('.env', `ADDRESS="${wallet.address}"\nPRIVATE_KEY="${wallet.privateKey}"`)
    console.log(`[INFO] wrote address and private key to .env`)


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
