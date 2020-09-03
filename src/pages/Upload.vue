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
        <span v-if="!upload && avatarLink !== ''" style="margin-top: 1rem;">Link to your avatar: <a :href="avatarLink">{{ avatarLink }}</a></span>
        <img :src="getAvatar()" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>

import { mapState } from 'vuex'

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
      custom: '#E56D9B'
    }
  },
  computed: {
    ...mapState(['uploadPct', 'avatarLink', 'avatarAfterUpload'])
  },
  watch: {
    uploadPct (val) {
      this.pct = parseInt(val)

      if (val === 100) {
        this.upload = false
      }
      console.log(val)
    }
  },
  methods: {
    getAvatar () {
      return this.avatarAfterUpload
    }
  },
  created () {
    console.log(this.uploadPct)
    if (this.uploadPct === '' || this.uploadPct === undefined || this.uploadPct === null) {
      this.pct = 0
    } else if (this.uploadPct !== 0) {
      this.pct = parseInt(this.uploadPct)
    }

    if (this.uploadPct === 100) {
      this.upload = false
      setTimeout(() => {
        this.$router.push({ path: '/' })
      }, 5000)
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
</style>
