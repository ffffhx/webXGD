import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.title = '万幸得以相逢' // 用户切换到其他 Tab 时的标题
  } else {
    document.title = '信息管理系统' // 用户回到当前 Tab 时的标题
  }
})
