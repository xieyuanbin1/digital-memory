import { createApp } from 'vue'
import App from './App.jsx'
import router from './router'
import store from './store'

// vant UI
import 'vant/lib/index.css'
// global less
// import './main.less'

createApp(App).use(store).use(router).mount('#app')
