import { createApp } from 'vue'
import App from './App.jsx'
import router from './router'
import store from './store'

// vant UI
import 'vant/lib/index.css'

createApp(App).use(store).use(router).mount('#app')
