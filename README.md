<h1 align="center">ArweaveAvatar</h1>
<p align="center">Avatar upload and manage for Arweave Identification</p>
<p align="center"> Link to Permaweb: <a href="https://arweave.net/633O1T1mQfbSCla-GzV5mqZ7hfqpU9LHAwgRvSM5r8c">Online</a></p>
<p align="center">
    <img src="https://github.com/AyakaLab/ArweaveAvatar/workflows/Node%20Build%20Test/badge.svg" />
    <img src="https://github.com/AyakaLab/ArweaveAvatar/workflows/Production%20CI%20Build%20Test/badge.svg" />
</p>

> We aim to make a avatar identification system like Arweave ID for users to use across the Arweave permaweb and the mass majority of dApps. We wanted to make a good tool for users to use as simple as they can to provide the such services.     
> We all know the Gavatar is the most known common Avatar serving service out there for the centralized web apps, but we are missing one of the tool to get users to their favorite avatar on the Arweave permaweb. So the project was born from such case. And as well as the Project [ArcLight](https://github.com/AyakaLab/ArcLight) dApp, it will need a avatar system though.   

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

## Integration

In case you need help to use ArQL to find out the user's avatar, I provide the following code as reference:     
``` Javascript
arweave.arql({
    op: 'and',  // use AND operator to bind expr1 and expr2 with AND connective
    expr1: {
        op: 'equals',  // use equals to bind expr1 and expr2 with Equals (===) connective
        expr1: 'from', // use from keyword to sepecify assets
        expr2: address // input a address to search
    },
    expr2: {
        op: 'or',  // use OR operator to bind expr1 and expr2 with OR connective
        expr1: {
            op: 'equals', //  use equals to bind expr1 and expr2 with Equals (===) connective
            expr1: 'App-Name', // sepecify tag name "App-Name"
            expr2: 'arweave-avatar' // specify tag value ''arweave-avatar"
        },
        expr2: {
            op: 'equals',  // // use equals to bind expr1 and expr2 with Equals (===) connective
            expr1: 'Type', // sepecify tag name "Type"
            expr2: 'avatar' // sepecify tag value "avatar"
        }
      }
})
```

Basically you can use the same code above to get the Tx IDs with ArQL.
And you will get many tx ids if a user has been updated the avatar for many times, you can use the first one. The first one is the lasted updated one for you to get.

To use the encoded image, you need to use the code below to get the data for <img src>
``` Javascript
function getAvatarFromId () {
    return new Promise((resolve, reject) => {
        arweave.transactions.getData(id, {decode: true, string: true}).then(data => {
            resolve(data)
        })
    })
})
```

### Reference
[arweave interface](https://www.arweave.org/build)    
[Arweave.js](https://github.com/ArweaveTeam/arweave-js): A library for interacting with the Arweave network from web applications and node.js programs.    
[Arweave Deploy](https://github.com/ArweaveTeam/arweave-deploy): A simple command line tool for deploying web apps, pages, and other files to the permaweb. 