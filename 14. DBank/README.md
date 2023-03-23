# dbank

Getting started:

```bash
cd dbank/
dfx help
dfx config --help
```

## Running the project locally

```bash
# Starts the replica, running in the background
dfx start

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:8000?canisterId={asset_canister_id}`.

To frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 8000.
