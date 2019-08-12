# secure-email-communication-using-blockchain
# A Decentralized Blockstack database that stores shared pairs of public key/email for secure email communication among different peers

If there are issues with some packages, just delete node_modules and package-lock files and execute the command:
- npm install

For having full access to the Blockstack app and checking personal pairs from your Blockstack account or other Blockstack users, user should run the script ‘webpack-dev-server’ by executing the command: 
- npm start 

For the realtime offline synchronization process among different peers and p2p decentralized database DPK via offline databbase gun module, user should run the script ‘node server.js’ by executing the command: 
- npm run serve

It is possible to store the pair in the GUN protocol via npm start, but it will only be synced offline to other peers via 'npm run serve’.

For the parallel process of both Blockstack interface and decentralized DPK gun database, user could run the script ‘concurrently --kill-others \"npm start\" \"npm run serve\"’ by executing the command: 
- npm run dev, even though it is not advised since it uses a lot of memory cache and takes a lot of time to compile.

For building the app, user could run the webpack by executing the command: 
- npm run build

For running different tests, user could run the script ‘npm run test --watch’ by executing the command: 
- npm run test:watch and specifying the test he wants.

For cleaning the memory cache of the app, user could run the script ‘rimraf dist’ by executing the command 
- npm clean
