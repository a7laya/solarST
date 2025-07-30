<template>
  <div>
    <canvas id="canvas"></canvas>
    <div class="control">
      <div><span>太阳系比例设置</span> <input type="text" v-model="systemRate">
        <button @click="systemRateChange('add')">+</button>
        <button @click="systemRateChange('sub')">-</button>
      </div>
      <div><span>倾斜角度</span> <input type="text" v-model="YRate">
        <button @click="YRateChange('add')">+</button>
        <button @click="YRateChange('sub')">-</button>
      </div>
      <div><span>行星轨道缩放</span> <input type="text" v-model="orbitalRate">
        <button @click="orbitalRateChange('add')">+</button>
        <button @click="orbitalRateChange('sub')">-</button>
      </div>
      <div>
        <span>行星运行速度</span> <input type="text" v-model="speedRate">
        <button @click="speedRateChange('add')">+</button>
        <button @click="speedRateChange('sub')">-</button>
      </div>
      <div><span>行星大小缩放</span> <input type="text" v-model="planetRate">
        <button @click="planetRateChange('add')">+</button>
        <button @click="planetRateChange('sub')">-</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Planet from '../lib/Planet.js'
// 获取画布
const canvas = ref(null)
// 获取画布上下文
const ctx = ref(null)
// 画布宽高
const w = ref(0)
const h = ref(0)
// 行星图片
const planetImg = {}
// 太阳图片 一个数组组成的动态图片组
const sunImg = []

// 鼠标拖动画面的各种变量
const isMouseDown = ref(false)
const startX = ref(0)
const startY = ref(0)
const sunX = ref(0)
const sunY = ref(0)
const lastSunX = ref(0)
const lastSunY = ref(0)




// 加载行星图片

const planetRate = ref(1)     // 行星大小缩放比例
const orbitalRate = ref(1/50)  // 行星轨道半径缩放比例
const speedRate = ref(0)  // 行星运行速度缩放比例 负数表示逆时针
const systemRate = ref(1)  // 整个系统缩放比例
const YRate = ref(1)      // 倾斜率 1-俯视



onMounted(async () => {
  canvas.value = document.getElementById('canvas')
  ctx.value = canvas.value.getContext('2d')
  // 设置画布宽高为浏览器窗口宽高 100vw
  w.value = canvas.value.width = window.innerWidth
  h.value = canvas.value.height = window.innerHeight

  sunX.value  = lastSunX.value = w.value / 2
  sunY.value  = lastSunY.value = h.value / 2


  // 载入图片资源
  await loadSunImages()
  await loadPlanetImages()
  


  

  // 以太阳半径为基准  构建其他行星的半径和轨道半径

  function animate() {
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    const config = {
      orbitalRate: orbitalRate.value, 
      systemRate:  systemRate.value,
      planetRate:  planetRate.value,
      speedRate:   speedRate.value,
      YRate: YRate.value
    }
    
    // 创建太阳
    // 根据performance.now()来控制太阳动图的帧率
    let sun  = new Planet(config, sunX.value, sunY.value,30, sunImg[Math.floor(performance.now() / 100) % sunImg.length],0,0)

    sun.draw(ctx.value)

    // 计算一个天文单位在屏幕上的显示距离  AU = 149600000km sunR = 696340km
    let AU = 149600000/696340 * sun.r
    // console.log(AU)

    // 创建水星
    let mercuryR = 2439.7/696340 * sun.r
    let mercurySpeed = 4.74
    let mercury = new Planet(config,  sun.sx, sun.sy, mercuryR, planetImg.mercury, AU*0.387, mercurySpeed,1 )
    mercury.draw(ctx.value)

    // 创建金星
    let venusR = 6051.8/696340 * sun.r
    let venusSpeed = 3.50
    let venus = new Planet(config,  sun.sx, sun.sy, venusR, planetImg.venus, AU*0.723, venusSpeed,1 )
    venus.draw(ctx.value)

    // 创建地球 
    let earthR = 6371/696340 * sun.r
    let earthSpeed = 2.98
    let earth = new Planet(config,  sun.sx, sun.sy, earthR,planetImg.earth,AU, earthSpeed,1 )
    earth.draw(ctx.value)

    // 创建月球
    let moonR = 1737.1/696340 * sun.r
    let moonSpeed = earthSpeed * 12
    let moon = new Planet(config,  earth.sx, earth.sy, moonR, planetImg.moon, AU/30*(planetRate.value/10 ), moonSpeed,0)
    // console.log(earth)
    moon.draw(ctx.value)

    // // 创建火星
    // let marsR = 3390/696340 * sun.r * planetRate.value
    // let marsSpeed = 1.87
    // let mars = new Planet( sun.sx, sun.sy, marsR, planetImg.mars, AU*1.52, marsSpeed,1 )
    // mars.draw(ctx.value)

    // // 创建木星
    // let jupiterR = 69911/696340 * sun.r * planetRate.value
    // let jupiterSpeed = 1.30 * speedRate.value
    // let jupiter = new Planet( sun.sx, sun.sy, jupiterR, planetImg.jupiter, AU*5.20, jupiterSpeed,1 )
    // jupiter.draw(ctx.value)

    // // 创建土星
    // let saturnR = 58232/696340 * sun.r * planetRate.value
    // let saturnSpeed = 0.96 * speedRate.value
    // let saturn = new Planet( sun.sx, sun.sy, saturnR, planetImg.saturn, AU*9.58, saturnSpeed,1 )
    // saturn.draw(ctx.value)

    // // 创建天王星
    // let uranusR = 25362/696340 * sun.r * planetRate.value
    // let uranusSpeed = 0.68 * speedRate.value
    // let uranus = new Planet( sun.sx, sun.sy, uranusR, '#00ffff', AU*19.18, uranusSpeed,1 )
    // uranus.draw(ctx.value)

    // // 创建海王星
    // let neptuneR = 24622/696340 * sun.r * planetRate.value
    // let neptuneSpeed = 0.54 * speedRate.value
    // let neptune = new Planet( sun.sx, sun.sy, neptuneR, '#0000ff', AU*30.07, neptuneSpeed,1 )
    // neptune.draw(ctx.value)

    // // 创建冥王星
    // let plutoR = 1188/696340 * sun.r * planetRate.value
    // let plutoSpeed = 0.77 * speedRate.value
    // let pluto = new Planet( sun.sx, sun.sy, plutoR, '#888888', AU*39.53, plutoSpeed,1 )
    // pluto.draw(ctx.value)

    // 下一帧继续调用animate函数
    requestAnimationFrame(animate)
  }
  animate()
  // 屏幕大小改变时，重新设置画布宽高
  window.addEventListener('resize', () => {
  w.value = window.innerWidth
  h.value = window.innerHeight
  })
  
  // 监听鼠标按下事件
  canvas.value.addEventListener('mousedown', handleMouseDown)
  // 监听鼠标松开事件
  canvas.value.addEventListener('mouseup', handleMouseUp)
  // 监听鼠标失焦事件
  canvas.value.addEventListener('mouseleave', handleMouseUp)
  // 监听鼠标移动事件
  canvas.value.addEventListener('mousemove', handleMouseMove)
  // 监听鼠标滚轮事件
  canvas.value.addEventListener('mousewheel', handleMouseWheel)

})

onUnmounted(() => {
  ctx.value.clearRect(0, 0, w, h)

})  

// 控制面板
function speedRateChange(value) { 
  if(value==='add') {
    speedRate.value += 1
  }else{
    speedRate.value -= 1
  }
}
function systemRateChange(value) {
  if(value==='add'){
    if(systemRate.value >= 10) {
      return
    }
    // systemRate.value += 0.1 防止出现小数点后太多位
    systemRate.value = Math.round(systemRate.value * 10 + 1) / 10
  }else{
    if(systemRate.value <= 0.1) {
      return
    }
    // systemRate.value -= 0.1  防止出现小数点后太多位
    systemRate.value = Math.round(systemRate.value * 10 - 1) / 10
  }
}

function YRateChange(value) {
  if(value==='add'){
    if(YRate.value >= 1) {
      return
    }
    // YRate.value += 0.1 防止出现小数点后太多位
    YRate.value = Math.round(YRate.value * 10 + 1) / 10
  }else{
    if(YRate.value < 0.1) {
      return YRate.value = 0
    }
    // YRate.value -= 0.1  // 防止出现小数点后太多位
    // YRate.value = YRate.value.toFixed(1)
    YRate.value = Math.round(YRate.value * 10 - 1) / 10
    console.log(YRate.value)
  }
}

function orbitalRateChange(value) {
  if(value==='add'){
    if(orbitalRate.value >= 0.99) {
      return
    }
    // orbitalRate.value += 0.01 防止出现小数点后太多位
    orbitalRate.value = Math.round(orbitalRate.value * 100 + 1) / 100
  }else{
    if(orbitalRate.value <= 0.01) {
      return
    }
    orbitalRate.value = Math.round(orbitalRate.value * 100 - 1) / 100
  }
}

function planetRateChange(value) {
  if(value==='add'){
    if(planetRate.value >= 20) {
      return
    }
    // planetRate.value += 0.1 防止出现小数点后太多位
    planetRate.value += 1
  }else{
    if(planetRate.value <= 1) {
      return
    }
    // planetRate.value -= 0.1  防止出现小数点后太多位
    planetRate.value -= 1
  }
}


function loadSunImages() {
  // 将'../../public/planet/sun'一组的图片共23张加载到sunImg对象中
  for (let i = 1; i <= 60; i++) {
    const img = new Image()
    img.src = `../../public/planet/sun/${i}.png`
    sunImg[i-1] = img
  }
  // console.log('sunImg:', sunImg)
  return Promise.all(Object.values(sunImg).map(img => new Promise(resolve => {
    img.onload = () => {
      resolve()
    }
    img.onerror = () => {
      console.error(`Failed to load sun/${i}.png`)
      resolve() // 继续加载其他图片
    }
  }))).then(() => {
    console.log('Sun images loaded:', sunImg)
  })
}



function loadPlanetImages() {
  return Promise.all([
    new Promise((resolve) => {
      const img = new Image()
      img.src = '../../public/planet/mercury.png'
      img.onload = () => {
        planetImg.mercury = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load mercury.png')
        resolve() // 继续加载其他图片
      }
    }),
    
    new Promise((resolve) => {
      const img = new Image()
      img.src = '../../public/planet/venus.png'
      img.onload = () => {
        planetImg.venus = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load venus.png')
        resolve() // 继续加载其他图片
      }
    }),
    new Promise((resolve) => {
      const img = new Image()
      img.src = '../../public/planet/earth.png'
      img.onload = () => {
        planetImg.earth = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load earth.png')
        resolve() // 继续加载其他图片
      }
    }),
    new Promise((resolve) => {
      const img = new Image()
      img.src = '../../public/planet/moon.png'
      img.onload = () => {
        planetImg.moon = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load moon.png')
        resolve() // 继续加载其他图片
      }
    }),
    new Promise((resolve) => {
      const img = new Image()
      img.src = '../../public/planet/mars.png'
      img.onload = () => {
        planetImg.mars = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load mars.png')
        resolve() // 继续加载其他图片
      }
    }),new Promise((resolve) => {
      const img = new Image()
      img.src = '../../public/planet/jupiter.png'
      img.onload = () => {
        planetImg.jupiter = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load jupiter.png')
        resolve() // 继续加载其他图片
      }
    }),
    new Promise((resolve) => {
      const img = new Image()
      img.src = '../../public/planet/saturn.png'
      img.onload = () => {
        planetImg.saturn = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load saturn.png')
        resolve() // 继续加载其他图片
      }
    }),
  ]).then(() => {
    console.log('Images loaded:', planetImg)
  })
}


function handleMouseDown(e) {
  isMouseDown.value = true
  startX.value = e.clientX
  startY.value = e.clientY
}

function handleMouseUp() {
  isMouseDown.value = false
  lastSunX.value = sunX.value
  lastSunY.value = sunY.value
}

function handleMouseMove(e) {
  if (isMouseDown.value) {
    let dx = e.clientX - startX.value
    let dy = e.clientY - startY.value
    sunX.value = lastSunX.value + dx
    sunY.value = lastSunY.value + dy
  } else {
    // 鼠标未按下时，将太阳位置重置为初始位置
    // lastSunX.value = sunX.value
    // lastSunY.value = sunY.value
  }
}

function handleMouseLeave() {
  isMouseDown.value = false
  lastSunX.value = sunX.value
  lastSunY.value = sunY.value
}

function handleWindowResize() {
  canvasWidth.value = window.innerWidth
  canvasHeight.value = window.innerHeight
}

function handleKeyDown(e) {
  if (e.key === 'ArrowUp') {
  }
}

// 处理鼠标滚轮事件
function handleMouseWheel(e) {
  console.log('e.deltaY:', e.deltaY)
  sunX.value += systemRate.value * e.deltaY / 100
  sunY.value += systemRate.value * e.deltaY / 100


  if (e.deltaY < 0) {
    // 向上滚动
    systemRate.value += 0.1
  } else {
    // 向下滚动
    systemRate.value -= 0.1
  }
}


</script>


<style scoped>
  .control{
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 999;
    /* 不随页面放大缩小 */
    transform: scale(1);
  }
  .control input{
    width: 10%;
    margin-bottom: 10px;
  }

  .control button{
    width: 22px;
    margin-bottom: 10px;
  }
  #canvas {
    cursor: grab;
  }
  
</style>
