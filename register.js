const { ethers } = require('ethers');
const axios = require('axios').default;
const fs = require('fs');
const API_URL = 'https://dev.zelus.io' // this can be changed to api.zelus.io if you want


/** Asynchronous entrypoint function */
async function main() {
    console.log(`[INFO] Registering an account with the dev backend. This will save wallet information to a local .env file.`);

    // create a random wallet
    const wallet = ethers.Wallet.createRandom();
    console.log(`[INFO] Created random wallet!`);
    console.log(`\tAddress: ${wallet.address}`);
    console.log(`\tPrivate key: ${wallet.privateKey}`);
    console.log(`\tPublic key: ${wallet.publicKey}`);

    // register the wallet with a sample, random email
    const email = `${Math.floor(Math.random() * 10000)}@ironwoodcyber.com`;

    // build and send the request
    const requestBody = {
        email,
        ethereum_address: wallet.address,
        imported: false
    }
    const registrationResponse = await axios.post(`${API_URL}/auth/register`, requestBody);
    if (registrationResponse.status !== 201) throw new Error(`Received non-201 status from backend: ${registrationResponse.status}`);
    console.log(`[INFO] registration complete!`);
    console.log(`[INFO] account information: `);
    console.log(`\tAddress: ${wallet.address}`);
    console.log(`\tEmail: ${email}`);
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