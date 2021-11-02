import { defineComponent, ref, reactive, onMounted } from 'vue'
import './app.less'
import { Dialog, Button, Toast, DropdownMenu, DropdownItem, Divider } from 'vant'

export default defineComponent({
  name: 'APP',
  setup (props, ctx) {
    const box = ref(36)
    const total = ref(9)
    const count = ref(1)
    const list = reactive([])
    const buttonText = ref('开始游戏')
    let timer = reactive({})
    const gameTime = ref(5000)
    const level = ref('A')
    const levelOptions = reactive([
      { text: '青铜', value: 'A' },
      { text: '黄金', value: 'B' },
      { text: '钻石', value: 'C' },
      { text: '大师', value: 'D' },
      { text: '王者', value: 'E' }
    ])
    const gameState = ref(0) // 游戏状态 0/不可点击 需要点击开始游戏或者重新开始游戏 1/开始游戏可以点击

    // init
    onMounted(() => {
      gameTime.value = 5000
      level.value = 'A'
      empt()
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
      for (let j = 1; j <= 9; j++) {
        let random = parseInt(Math.random() * (36 - 1 + 1) + 1, 10)
        while (list[random].text != null) {
          random = parseInt(Math.random() * (36 - 1 + 1) + 1, 10)
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

        // success
        if (cur.hit === total.value) {
          Dialog({ message: '恭喜您!' }).then(() => {
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
        gameover()
      }
    }

    // 切换游戏 等级
    function handleChangeLevel (name) {
      empt()
      gameState.value = 0
      console.log('change:', name)
      console.log('level:', level.value)
      switch (name) {
        case 'A':
          gameTime.value = 5000
          break
        case 'B':
          gameTime.value = 4000
          break
        case 'C':
          gameTime.value = 3000
          break
        case 'D':
          gameTime.value = 2000
          break
        case 'E':
          gameTime.value = 1000
          break
      }
    }
    return () => (
      <div class="main">
        <div class="level-box">
          <Divider style={{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }}>游戏等级</Divider>
          <DropdownMenu>
            <DropdownItem v-model={ level.value } onChange={handleChangeLevel} options={levelOptions} />
          </DropdownMenu>
        </div>
        <div class="menu">
          <Button type="primary" size="small" onClick={handleStart}>{buttonText.value}</Button>
        </div>
        <div class="box-container">
          {
            list.map(item => {
              return (
                <p class="box" onClick={() => handleGuess(item)}>{item.text}</p>
              )
            })
          }
        </div>
      </div>
    )
  }
})
