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
    uploadPct: 0,
    avatarId: '',
    avatarLink: '',
    avatarAfterUpload: ''
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
    setAvatarId (state, id) {
      state.avatarId = id
    },
    setAvatarLink (state, link) {
      state.avatarLink = link
    },
    setAvatarAfterUpload (state, avatar) {
      state.avatarAfterUpload = avatar
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
    },
    uploadFile ({ commit }, data) {
      commit('setAvatarLink', '')
      commit('setAvatarId', '')
      ar.createTransaction({ data: data.data }, data.key).then(async transaction => {
        transaction.addTag('Content-Type', data.type)
        transaction.addTag('App-Name', 'arweave-avatar')
        transaction.addTag('Unix-Time', Date.now())
        transaction.addTag('Type', 'avatar')

        await ar.transactions.sign(transaction, data.key)
        let uploader = await ar.transactions.getUploader(transaction)

        while (!uploader.isComplete) {
          await uploader.uploadChunk()
          commit('setUploadPct', uploader.pctComplete)
          console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
        }

        commit('setAvatarId', transaction.id)
        commit('setAvatarLink', 'http://viewblock.io/arweave/tx/' + transaction.id)

        await ar.transactions.post(transaction)
      })
    },
    setAvatarId ({ commit }, id) {
      commit('setAvatarId', id)
    },
    getAvatarFromId ({ commit }, id) {
      ar.transactions.getData(id, {decode: true, string: true}).then(data => {
        commit('setAvatarAfterUpload', data)
      })
    },
    uploadReset ({ commit }) {
      commit('setAvatarAfterUpload', '')
      commit('setUploadPct', 0)
    }
  }
})
