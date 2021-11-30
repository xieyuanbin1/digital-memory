import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import './app.less'

export default defineComponent({
  name: 'App',
  setup () {
    return () => (
      // {/* 路由出口 */}
      // {/* 路由匹配到的组件将渲染在这里 */}
      <RouterView />
      // <router-view />
    )
  }
})
