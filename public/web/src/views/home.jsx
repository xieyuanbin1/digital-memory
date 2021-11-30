import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import './home.less'

export default defineComponent({
  name: 'Home',
  setup (props, ctx) {
    // 设置页面显示游戏版本
    const version = ref('v1.0.4')
    const levelList = reactive([
      {
        level: 'A',
        box: 25,
        total: 5,
        gameTime: 3000
      },
      {
        level: 'B',
        box: 36,
        total: 6,
        gameTime: 3000
      },
      {
        level: 'C',
        box: 25,
        total: 5,
        gameTime: 1000
      },
      {
        level: 'D',
        box: 36,
        total: 9,
        gameTime: 1000
      }
    ])
    const router = useRouter()
    function handlePlayGame (level) {
      console.log('>> level:', level)
      router.push({
        path: '/game',
        query: {
          box: level.box,
          total: level.total,
          gameTime: level.gameTime
        }
      })
    }

    return () => (
      <div class="home">
        <div class="game-name">数字记忆</div>
        <div class="game-description">
          <p>在短时间内记住数字顺序及位置</p>
          <p>增强瞬时记忆及反应能力</p>
        </div>

        <div class="level-list">
          {
            levelList.map(level => (
              <p onClick={() => handlePlayGame(level)}>{Math.sqrt(level.box)} * {Math.sqrt(level.box)}个格子 {level.total}个总数 {level.gameTime / 1000}s</p>
            ))
          }
        </div>

        <div class="version-container"><p class="client-version">{version.value}</p></div>
      </div>
    )
  }
})
