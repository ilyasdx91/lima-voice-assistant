import './assets/scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'

// PWA Service Worker registration
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 New content available, refresh to update')
  },
  onOfflineReady() {
    console.log('📱 App ready to work offline')
  },
})

createApp(App).mount('#app')
