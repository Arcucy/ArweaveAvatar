import Vue from 'vue'
import Vuex from 'vuex'

import API from '../api/api'

import Arweave from 'arweave'

let ar = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    keyFileContent: '',
    walletAddress: '',
    avatar: '',
    avatarFile: '',
    uploadPct: '',
    avatarLink: ''
  },
  mutations: {
    setKeyFileContent (state, file) {
      state.keyFileContent = file
    },
    setWalletAddress (state, address) {
      state.walletAddress = address
    },
    setAvatar (state, avatar) {
      state.avatar = avatar
    },
    setAvatarFile (state, avatarFile) {
      state.avatarFile = avatarFile
    },
    setUploadPct (state, pct) {
      state.uploadPct = pct
    },
    setAvatarLink (state, link) {
      state.avatarLink = link
    }
  },
  getters: {
  },
  actions: {
    setKeyFileContent ({ commit }, file) {
      commit('setKeyFileContent', file)

      API.arweave.getAddress(file).then(res => {
        commit('setWalletAddress', res)
      })
    },
    setWalletAddress ({ commit }, address) {
      commit('setWalletAddress', address)
    },
    setAvatar ({ commit }, avatar) {
      commit('setAvatar', avatar)
    },
    setAvatarFile ({ commit }, avatarFile) {
      commit('setAvatarFile', avatarFile)
      console.log(avatarFile)
    },
    uploadFile ({ commit }, data) {
      ar.createTransaction({ data: data.data }, data.key).then(async transaction => {
        transaction.addTag('Content-Type', data.type)
        transaction.addTag('App-Name', 'arweave-avatar')
        transaction.addTag('Unix-Time', Date.now())
        transaction.addTag('Type', 'avatar')

        await ar.transactions.sign(transaction, data.key)
        let uploader = await ar.transactions.getUploader(transaction)

        console.log(transaction)
        while (!uploader.isComplete) {
          await uploader.uploadChunk()
          console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
          commit('setUploadPct', uploader.pctComplete)
        }

        commit('setAvatarLink', 'https://arweave.net/' + transaction.id)

        const response = await ar.transactions.post(transaction)
        console.log(response)
      })
    },
    setAvatarLink ({ commit }, link) {
      commit('setAvatarLink', link)
    }
  }
})
