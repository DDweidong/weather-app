//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '../node_modules/element-plus/dist/index.css'
//
import './assets/iconfont/iconfont.css'
import IconFont from './components/IconFont.vue'
//
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(pinia)
app.component('iconfont',IconFont)
app.mount('#app')
