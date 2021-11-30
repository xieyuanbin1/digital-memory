import { defineComponent, ref, reactive, onMounted, onBeforeMount } from 'vue'
import './game.less'
import { Dialog, Toast } from 'vant'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'GAME',
  setup (props, ctx) {
    const router = useRouter()
    const route = useRoute()
    const box = ref(25)
    //
    const boxWidth = ref(0)
    // 设定数字数量
    const total = ref(5)
    // 点击顺序
    const count = ref(1)
    // 当前分数 计算规则
    const score = ref(0)
    // 总分数 计算规则
    const highest = ref(0)
    const list = reactive([])
    const buttonText = ref('开始游戏')
    let timer = reactive({})
    const gameTime = ref(3000)
    /**
     * 游戏等级
     * 游戏等级  方格数量  数字数量  记忆时间
     * A        25       5       3s
     * B        36       6       1s
     * C        25       5       3s
     * D        36       9       1s
     */
    // const level = ref('A')
    // 游戏状态 0/不可点击 需要点击开始游戏或者重新开始游戏 1/开始游戏可以点击
    const gameState = ref(0)

    onBeforeMount(() => {
      console.log('>>>>>>>>>>> onBeforeMount <<<<<<<<<<<<<<')
      console.log('>> route:', route.query)
      const selectData = route.query
      box.value = Number(selectData.box)
      total.value = Number(selectData.total)
      gameTime.value = Number(selectData.gameTime)
    })

    // init
    onMounted(() => {
      empt()
      const offsetWidth = document.querySelector('.box-container').offsetWidth
      console.log('>>>> offsetWidth:', document.querySelector('.box-container').offsetWidth)
      boxWidth.value = Math.floor((offsetWidth - 50) / Math.sqrt(box.value))
      console.log('>>>>> width:', boxWidth.value)
    })

    // set empt
    function empt () {
      for (let i = 1; i <= box.value; i++) {
        list[i] = {
          index: i,
          hit: null,
          text: null
        }
      }
      count.value = 1
    }

    function hideText () {
      for (let i = 1; i <= box.value; i++) {
        list[i].text = null
      }
    }

    function showText () {
      for (let i = 1; i <= box.value; i++) {
        list[i].text = list[i].hit
      }
    }

    // restart
    function restart () {
      clearTimeout(timer)
      buttonText.value = '重新游戏'
      // empt
      empt()
      // fill number
      for (let j = 1; j <= total.value; j++) {
        let random = parseInt(Math.random() * (box.value - 1 + 1) + 1, 10)
        while (list[random].text != null) {
          random = parseInt(Math.random() * (box.value - 1 + 1) + 1, 10)
        }
        list[random].text = j
        list[random].hit = j
      }

      // hide text
      timer = setTimeout(() => {
        hideText()
        gameState.value = 1
      }, gameTime.value)
    }

    // game start
    function handleStart () {
      console.log('>> Game Start <<')
      gameState.value = 0
      restart()
    }

    // game over show all digital
    function gameover () {
      showText()
    }

    function handleGuess (cur) {
      console.log('cur:', cur)
      console.log('count:', count.value)
      console.log('total:', total.value)
      if (!gameState.value) {
        // Toast({
        //   type: 'fail',
        //   message: '请开始游戏!',
        //   position: 'bottom',
        //   duration: 1000
        // })
        return 0
      }
      if (cur.hit === count.value) {
        list[cur.index].text = cur.hit
        count.value++
        // 连击 最高连击
        score.value++
        highest.value = Math.max(score.value, highest.value)

        // success
        if (cur.hit === total.value) {
          Dialog({ message: '恭喜您，过关!' }).then(() => {
            gameState.value = 0
          }).catch(e => {
            gameState.value = 0
          })
        }
      } else {
        Toast({
          type: 'fail',
          message: '游戏结束!',
          position: 'bottom',
          duration: 2000
        })
        gameState.value = 0
        score.value = 0
        gameover()
      }
    }

    // 切换游戏 等级
    function handleChangeLevel (name) {
      router.push('/')
      // empt()
      // gameState.value = 0
      // console.log('change:', name)
      // console.log('level:', level.value)
      // box.value = 36
      // total.value = 9
    }

    return () => (
      <div class="game">
        <div className="top-container">
          <div className="size-box">
            <div className="game-name">1 ~ { total.value }</div>
            <div className="wid-hei">{ Math.sqrt(box.value) } * { Math.sqrt(box.value) }</div>
          </div>
          <div className="current-score-box">
            <div class="score">
              <p>连击</p>
              <p>{ score.value }</p>
            </div>
            <div class="re-start">
              <p onClick={handleStart}>{buttonText.value}</p>
            </div>
          </div>
          <div className="highest-score-box">
            <div className="highest">
              <p>最高连击</p>
              <p>{ highest.value }</p>
            </div>
            <div class="change-level">
              <p onClick={handleChangeLevel}>选择难度</p>
            </div>
          </div>
        </div>
        <div class="box-container" style={{ height: `${boxWidth.value * Math.sqrt(box.value) + (Math.sqrt(box.value) + 1) * 10}px` }}>
          {
            list.map(item => {
              return (
                <p class="box" style={{
                  width: `${boxWidth.value}px`,
                  height: `${boxWidth.value}px`,
                  lineHeight: `${boxWidth.value}px`
                }} onClick={() => handleGuess(item)}>{item.text}</p>
              )
            })
          }
        </div>
      </div>
    )
  }
})
