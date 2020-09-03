import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home.vue'
import SetAvatar from '@/pages/SetAvatar.vue'
import Upload from '@/pages/Upload.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/set',
      name: 'SetAvatar',
      component: SetAvatar
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    }
  ]
})
