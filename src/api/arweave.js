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
        console.log(ids)

        if (ids.length === 0) {
          resolve(false)
          return
        }
        // let all = []
        let detail = await this.getTransactionDetail(ids[0]).catch((err) => {
          resolve(err)
        })

        // for (let i = 0; i < ids.length; i++) {
        //   let detail = await this.getTransactionDetail(ids[i])
        //   detail.get('tags').forEach(tag => {
        //     let key = tag.get('name', { decode: true, string: true })
        //     let value = tag.get('value', { decode: true, string: true })
        //     if (key === 'Unix-Time') {
        //       console.log(`${key} : ${value}`)
        //       all.push({
        //         id: ids[i],
        //         time: value
        //       })
        //     }
        //   })
        // }
        // if (all.length === 0) {
        //   resolve(false)
        //   return
        // }

        // let last = {}
        // all.forEach((item, index) => {
        //   if (index === 0) {
        //     last = item
        //     return
        //   }

        //   if (last.unix < item.unix) {
        //     last = item
        //     return last
        //   }
        // })
        console.log(detail.id)
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

      console.log(transaction)
      while (!uploader.isComplete) {
        await uploader.uploadChunk()
        console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
      }

      console.log(data)
      // const response = await ar.transactions.post(transaction)
      // console.log(response)
    })
  }
}

export default arweave
