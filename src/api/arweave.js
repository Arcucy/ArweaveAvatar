import Arweave from 'arweave'

let ar = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
})

let arweave = {
  getAddress (key) {
    return new Promise((resolve, reject) => {
      ar.wallets.jwkToAddress(key).then((address) => {
        resolve(address)
      }).catch(err => {
        reject(err)
      })
    })
  },

  getTransactionDetail (txid) {
    return new Promise((resolve, reject) => {
      ar.transactions.get(txid).then(detail => {
        resolve(detail)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },

  getAvatar (address) {
    return new Promise((resolve, reject) => {
      console.log('collecting data for:', address)
      ar.arql({
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'from',
          expr2: address
        },
        expr2: {
          op: 'or',
          expr1: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: 'arweave-avatar'
          },
          expr2: {
            op: 'equals',
            expr1: 'Type',
            expr2: 'avatar'
          }
        }
      }).then(async ids => {
        if (ids.length === 0) {
          resolve({ result: 'no image found' })
          return
        }

        let detail = await this.getTransactionDetail(ids[0]).catch((err) => {
          if (JSON.parse(JSON.stringify(err)).type === 'TX_PENDING') resolve({ result: 'pending on confirm' })
        })

        if (!detail) {
          resolve({ result: 'pending on upload' })
          return
        }

        ar.transactions.getData(detail.id, {decode: true, string: true}).then(data => {
          resolve(data)
        })
      })
    })
  },

  async postAvatarTransaction (data, key, type) {
    ar.createTransaction({ data: data }, key).then(async transaction => {
      transaction.addTag('Content-Type', type)
      transaction.addTag('App-Name', 'arweave-avatar')
      transaction.addTag('Unix-Time', Date.now())
      transaction.addTag('Type', 'avatar')

      await ar.transactions.sign(transaction, key)
      let uploader = await ar.transactions.getUploader(transaction)

      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }

      await ar.transactions.post(transaction)
    })
  }
}

export default arweave
