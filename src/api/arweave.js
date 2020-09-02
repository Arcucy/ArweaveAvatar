import Arweave from 'arweave'
import Axios from 'axios'

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
        reject(err)
      })
    })
  },

  getAvatar (address) {
    let all = []
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
      }).then(ids => {
        ids.forEach(id => {
          this.getTransactionDetail(id).then(detail => {
            detail.get('tags').forEach(tag => {
              let key = tag.get('name', { decode: true, string: true })
              let value = tag.get('value', { decode: true, string: true })
              if (key === 'Unix-Time') {
                all.push({
                  id: id,
                  time: value
                })
              }
            })
          })
        })
      })

      if (all.length === 0) {
        resolve(false)
        return
      }

      let last = {}
      all.forEach((item, index) => {
        if (index === 0) {
          last = item
          return
        }

        if (last.unix < item.unix) {
          last = item
        }
      })

      Axios.get('https://arweave.net/' + last.id, {
        responseType: 'arraybuffer'
      }).then(response => resolve(Buffer.from(response.data, 'binary').toString('base64')))
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

      console.log(transaction)
      while (!uploader.isComplete) {
        await uploader.uploadChunk()
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
      }

      const response = await ar.transactions.post(transaction)
      console.log(response)
    })
  }
}

export default arweave
