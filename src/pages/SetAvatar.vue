<template>
  <div>
    <Header />
    <div class="set-container">
      <div class="wallet">
        {{ walletAddress }}
      </div>
      <el-progress v-if="loading" type="circle" :percentage="loadingPct" :status="loadingStatus"></el-progress>
      <div v-else class="upload">
        <img-upload
          :img-upload-done="imgUploadDone"
          :update-type="'avatar'"
          class="app-icon"
          @doneImageUpload="doneImageUpload"
        >
          <div
            slot="uploadButton"
            class="user-avatar"
          >
            <div class="edit">
              <i class="el-icon-camera" />
              Avatar
            </div>
            <img
              id="avatar"
              v-if="avatar"
              slot="description"
              :src="avatar"
              alt="avatar"
            >
            <img v-else id="new-logo" src="../assets/logo.png" style="height:80px;width: 84.96px;padding-top: 35%;"/>
          </div>
        </img-upload>
        <br>
        <div v-if="!needUpload" class="file">
          {{ fileName }}
        </div>
        <el-button v-if="!needUpload" style="margin-top: 1.5rem;" size="small" type="primary" @click="submit">Confirm</el-button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import API from '../api/api'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import imgUpload from '@/components/imgUpload/imgUpload.vue'

export default {
  components: {
    imgUpload,
    Header,
    Footer
  },
  data () {
    return {
      needUpload: true,
      attachments: [],
      avatar: '',
      fileContent: '',
      fileRaw: '',
      fileName: '',
      imgUploadDone: 0,
      loading: true,
      loadingPct: 0,
      loadingStatus: ''
    }
  },
  computed: {
    ...mapState(['keyFileContent', 'walletAddress', 'avatarFile'])
  },
  watch: {
    walletAddress (val) {
      this.setWalletAddress(val)
    }
  },
  methods: {
    ...mapActions(['setWalletAddress', 'setAvatar', 'uploadFile']),
    submit () {
      this.setAvatar(this.fileContent)
      let type = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        webp: 'image/webp'
      }
      let ext = this.avatarFile.name.split('.').pop()
      console.log('Content-Type:', type[ext])
      this.uploadFile({ data: this.fileRaw, key: this.keyFileContent, type: type[ext] })
      this.$router.push({ path: '/upload' })
    },
    handleRemove (file) {
      return file
    },
    doneImageUpload () {
      this.avatar = this.avatarFile
      this.fileName = this.avatar.name
      const reader = new FileReader()
      reader.readAsDataURL(this.avatar)
      reader.onload = async (e) => {
        try {
          this.fileContent = e.target.result
          this.fileRaw = this.fileContent
          this.needUpload = false
          this.avatar = this.fileRaw
          this.$message({
            message: 'Upload Successful',
            type: 'success',
            duration: 3000
          })
        } catch (err) {
          this.$message({
            message: `Load image file error: ${err.message}`,
            type: 'error',
            duration: 3000
          })
        }
      }
      this.imgUploadDone += Date.now()
      this.$message({
        message: 'Loaded Success',
        type: 'success',
        duration: 4000
      })
    }
  },
  mounted () {
    setTimeout(() => {
      if (this.walletAddress === '') {
        this.$router.push({ path: '/' })
      }

      let intervalId = setInterval(() => {
        if (this.loadingPct === 100) {
          this.loadingStatus = 'exception'
          this.$message({
            message: 'Avatar not Found or is Pending on confirmation',
            type: 'error',
            duration: 4000
          })
        } else {
          this.loadingPct++
        }
      }, 500)

      API.arweave.getAvatar(this.walletAddress).then(res => {
        if (!res) {
          this.loadingStatus = 'exception'
          this.$message({
            message: 'Avatar not Found or is Pending on confirmation',
            type: 'error',
            duration: 4000
          })
          clearInterval(intervalId)
        }
        this.avatar = res
        clearInterval(intervalId)
        this.loadingPct = 100

        setTimeout(() => {
          this.loading = false
        }, 2000)

        return res
      })
    }, 2000)
  }
}
</script>

<style lang="less" scoped>
.upload {
  margin-top: 1rem;
}

.wallet {
  margin-bottom: 2rem;
}

.user-avatar {
  margin: 0 auto;
}

.app-icon {
  cursor: pointer;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width:300px;
  height:300px;
  object-fit: cover;
  background:rgba(241,241,241,1);
  border-radius:8px;
  &:hover {
    background-color: #E5E5E5;
  }
  .user-avatar > img {
    width: 280px;
    height: 280px;
  }
  &:hover .edit {
    display: flex;
  }
  .edit {
    border-radius: 10px;
    width: 280px;
    height: 280px;
    margin-top: 10px;
    margin-left: 10px;
    display: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: #eee;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    .el-icon-camera {
      font-size: 24px;
      margin-bottom: 4px;
      color: #eee;
    }
  }
}

#new-logo {
  width: 84px;
  height: 80px;
}

#avatar {
  margin-top: 10px;
}
</style>
