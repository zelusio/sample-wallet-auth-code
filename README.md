# sample-wallet-auth-code
Sample code to authenticate to the wallet backend without using the mobile app. May be useful for testing purposes.

## Usage

1. Select which environment you are using (sandbox or production) and set the appropriate `API_URL` in `login.js` and `register.js`. Options are:
    * `dev.wallet.zelus.io`
    * `staging.wallet.zelus.io`
    * `prod.wallet.zelus.io` / `wallet.zelus.io` (These are the same)

    _Note that staging and prod require an actual Zelus wallet account for email verification to work._ In the Dev environment,
email verification can be bypassed using `+noverify` in the email address. For example, `test+noverify@hackerone.com` will bypass email verification.

2. Run `npm install` to install dependencies.
3. Run `yarn run register` to register a new user. This will create a new wallet, store it in `.env`, and register it.
4. Run `yarn run login` to login to the wallet. This will store the JWT in `token.txt`
5. Use the JWT to authenticate to the wallet backend as well as to other Zelus services. See `deveks.zelus.io`. 
