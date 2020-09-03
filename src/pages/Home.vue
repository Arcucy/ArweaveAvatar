<template>
  <div class="home">
    <Header />
    <div class="upload">
      <el-upload
        v-if="needUpload"
        action="null"
        class="upload-demo"
        drag
        accept="application/json"
        :file-list="attachments"
        :on-remove="handleRemove"
        :on-change="fileChange"
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Drag and drop your wallet key here or <em>Click</em> to upload</div>
      </el-upload>
      <div v-if="!needUpload" class="file">
        {{ fileName }}
        <br>
        <el-input
          class="file-content"
          type="textarea"
          :rows="20"
          placeholder=""
          :disabled="true"
          v-model="fileRaw">
        </el-input>
      </div>
      <el-button v-if="!needUpload" style="margin-top: 1.5rem;" type="danger" @click="needUpload = true">Re-Upload</el-button>
      <el-button v-if="!needUpload" style="margin-top: 1.5rem;" type="success" @click="submit">Confirm</el-button>
    </div>
    <div class="introduction">
      <p><strong>Arweave Avatar is a dApp running on permaweb.</strong><br>
      By using this dApp, you can upload your <strong>avatar to the permaweb</strong> in case you need everybody to
      recognize you.<br>
      We do not collect any data from your device, this project is open sourced, anyone is welcomed to contribute to this dApp on Arweave.</p>
    </div>
    <Footer />
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  },
  data: function () {
    return {
      needUpload: true,
      attachments: [],
      keyFile: '',
      fileContent: '',
      fileRaw: '',
      fileName: ''
    }
  },
  watch: {
    attachments (val) {
      console.log(val)
    }
  },
  computed: {
    ...mapState(['keyFileContent'])
  },
  methods: {
    ...mapActions(['setKeyFileContent']),
    fileChange (file) {
      this.keyFile = file
      this.fileName = this.keyFile.name
      const reader = new FileReader()
      reader.readAsText(this.keyFile.raw)
      reader.onload = async (e) => {
        try {
          this.fileContent = JSON.parse(e.target.result)
          this.fileRaw = JSON.stringify(this.fileContent)
          this.needUpload = false
          this.$message({
            message: 'Upload Successful',
            type: 'success',
            duration: 3000
          })
        } catch (err) {
          this.$message({
            message: `Load JSON file error: ${err.message}`,
            type: 'error',
            duration: 3000
          })
        }
      }
    },
    submit () {
      this.setKeyFileContent(this.fileContent)
      this.$router.push({ path: '/set' })
    },
    handleRemove (file) {
      return file
    }
  }
}
</script>

<style lang="less" scoped>

.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.file-content {
  margin-top: 1rem;
}

.introduction {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
}

/deep/ .el-upload-dragger {
  border: 4px dashed rgba(240, 151, 187, 0.5);
}
</style>
