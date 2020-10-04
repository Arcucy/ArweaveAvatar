<template>
  <div>
    <Header />
    <div class='upload-container'>
      <div class="upload-progress">
        <el-progress class="bar" v-if='upload' :text-inside="true" :stroke-width="26" :percentage="pct" :color="custom"></el-progress>
      </div>
      <div v-if='!upload' class="success-info">
        <i class="el-icon-success" style="font-size: 10rem; color: #67C23A;"></i>
        <span>Upload Successful!</span>
        <span v-if="!upload && avatarTxDisplay !== ''" style="margin-top: 1rem;">Transaction to your avatar: <a :href="avatarTxDisplay">{{ avatarTxDisplay }}</a></span>
        <img :src="getAvatar()" class="avatar"/>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  },
  data () {
    return {
      pct: 0,
      upload: true,
      custom: '#E56D9B',
      avatarTxDisplay: ''
    }
  },
  computed: {
    ...mapState(['uploadPct', 'avatarLink', 'avatarId', 'avatarAfterUpload'])
  },
  watch: {
    uploadPct (val) {
      this.pct = parseInt(val)

      if (val === 100) {
        this.$message({
          message: 'Your avatar will be available on next mine',
          type: 'success',
          duration: 6000
        })
        this.upload = false
      } else {
        this.upload = true
        this.pct = 0
      }
    },
    avatarLink (val) {
      if (val) this.avatarTxDisplay = val
    }
  },
  methods: {
    ...mapActions(['getAvatarFromId', 'uploadReset']),
    getAvatar () {
      this.getAvatarFromId(this.avatarId)
      return this.avatarAfterUpload
    }
  },
  created () {
    if (this.uploadPct === '' || this.uploadPct === undefined || this.uploadPct === null) {
      this.pct = 0
    } else if (this.uploadPct !== 0) {
      this.pct = parseInt(this.uploadPct)
    }

    if (this.uploadPct === 100) {
      this.$message({
        message: 'Your avatar will be available on next mine',
        type: 'success',
        duration: 6000
      })
      this.upload = false
      setTimeout(() => {
        this.uploadReset()
      }, 6000)
    }
  }
}
</script>

<style lang="less" scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.success-info {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.upload-progress {
  width: 70vw;
}

.avatar {
  height: 250px;
  width: 250px;
  margin: 1rem auto;
}
</style>
