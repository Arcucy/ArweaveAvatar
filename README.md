<h1 align="center">ArweaveAvatar</h1>
<p align="center">Avatar upload and manage for Arweave Identification</p>
<p align="center"> Link at Permaweb: <a href="https://arweave.net/6rDkV6Dg8IqMliS7ucT_5NVkl50UWxBcg9N-AuEBXmU">Online</a></p>
<p align="center">
    <img src="https://github.com/AyakaLab/ArweaveAvatar/workflows/Node%20Build%20Test/badge.svg" />
    <img src="https://github.com/AyakaLab/ArweaveAvatar/workflows/Production%20CI%20Build%20Test/badge.svg" />
</p>

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build

# build for production and view the bundle analyzer report
yarn build --report
```

### Deploy using a key
``` bash
arweave deploy-dir ./dist --key-file /path/to/key.json
```

### Reference
[arweave interface](https://www.arweave.org/build)    
[Arweave.js](https://github.com/ArweaveTeam/arweave-js): A library for interacting with the Arweave network from web applications and node.js programs.    
[Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy): A simple command line tool for deploying web apps, pages, and other files to the permaweb. 