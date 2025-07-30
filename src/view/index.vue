<template>
  <div>
    <canvas id="canvas"></canvas>
    <div class="control" style="width:200px">
      <div><span>画面比例设置</span> <input type="text" v-model="config.systemRate">
        <button @click="systemRateChange('add')">+</button>
        <button @click="systemRateChange('sub')">-</button>
      </div>
      <div><span>Y 轴 缩小比例 </span> <input type="text" v-model="config.yRate">
        <button @click="yRateChange('add')">+</button>
        <button @click="yRateChange('sub')">-</button>
      </div>
      <div><span>行星轨道缩放</span> <input type="text" v-model="config.oRate">
        <button @click="oRateChange('add')">+</button>
        <button @click="oRateChange('sub')">-</button>
      </div>
      <div>
        <span>行星运行速度</span> <input type="text" v-model="config.sRate">
        <button @click="sRateChange('add')">+</button>
        <button @click="sRateChange('sub')">-</button>
      </div>
      <div><span>行星大小缩放</span> <input type="text" v-model="config.rRate">
        <button @click="rRateChange('add')">+</button>
        <button @click="rRateChange('sub')">-</button>
      </div>
    </div>
  </div>
</template>

<script>
import Planet from '@/lib/Planet.js'
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      sunR: 100, // 太阳半径 这是整个系统的尺度标准 其他天体的尺度都是基于这个比例
      planets: {},
      imgs: {sun:[], earth:[], moon:[], mercury:[], venus:[], mars:[], jupiter:[], saturn:[], uranus:[], neptune:[]},
      config: {
        systemRate: 1, // 太阳系比例设置
        yRate: 1, // 倾斜角度
        oRate: 0.02, // 行星轨道缩放
        sRate: 1, // 行星运行速度
        rRate: 1, // 行星大小缩放
        ctx: null,
      },
      // 鼠标拖动画面的各种变量
      isMouseDown: false,
      startX: 0,
      startY: 0,
      sunX: 0,
      sunY: 0,
      lastSunX: 0,
      lastSunY: 0,
    }
  },
  computed: {
    // 根据太阳半径计算八大行星半径
    mercuryR () { return this.sunR/285.4 },
    venusR   () { return this.sunR/115.1 },
    earthR   () { return this.sunR/109.3 },
    marsR    () { return this.sunR/205.5 },
    jupiterR () { return this.sunR/9.96 },
    saturnR  () { return this.sunR/12.0 },
    uranusR  () { return this.sunR/27.5 },
    neptuneR () { return this.sunR/28.3 },

    // 月球半径
    moonR () { return this.earthR/3.67 },

    // 根据太阳半径计算八大行星轨道半径
    // AU = 149600000km sunR = 696340km
    AU() { return this.sunR * 149600000 / 696340 },
    earthOR   () { return this.AU * 1 },
    moonOR    () { return this.earthR * 30 / this.config.oRate},
    mercuryOR () { return this.AU * 0.387 },
    venusOR   () { return this.AU * 0.723 },
    marsOR    () { return this.AU * 1.524 },
    jupiterOR () { return this.AU * 5.203 },
    saturnOR  () { return this.AU * 9.537 },
    uranusOR  () { return this.AU * 19.191 },
    neptuneOR () { return this.AU * 30.069 },
  },
  created() {
    this.planets.sun     = {name: 'sun',     r: this.sunR,     img: this.imgs.sun || '#f00', speed: 0, orbitalR: 0}
    this.planets.mercury = {name: 'mercury', r: this.mercuryR, img: this.imgs.mercury || '#f0f', speed: 4.09,   orbitalR: this.mercuryOR}
    this.planets.venus   = {name: 'venus',   r: this.venusR,   img: this.imgs.venus || '#0f0', speed: 1.60,   orbitalR: this.venusOR}
    this.planets.earth   = {name: 'earth',   r: this.earthR,   img: this.imgs.earth || '#0ca5e1', speed: 1.00,   orbitalR: this.earthOR}
    this.planets.mars    = {name: 'mars',    r: this.marsR,    img: this.imgs.mars || '#f00', speed: 0.53,   orbitalR: this.marsOR}
    this.planets.jupiter = {name: 'jupiter', r: this.jupiterR, img: this.imgs.jupiter || '#f0f', speed: 0.084,  orbitalR: this.jupiterOR}
    this.planets.saturn  = {name: 'saturn',  r: this.saturnR,  img: this.imgs.saturn || '#0ff', speed: 0.034,  orbitalR: this.saturnOR}
    this.planets.uranus  = {name: 'uranus',  r: this.uranusR,  img: this.imgs.venus || '#00f', speed: 0.0012, orbitalR: this.uranusOR}
    this.planets.neptune = {name: 'neptune', r: this.neptuneR, img: this.imgs.venus || '#0f0', speed: 0.006,  orbitalR: this.neptuneOR}
    this.planets.moon    = {name: 'moon',    r: this.moonR,    img: this.imgs.moon || '#fff', speed: 13.2,   orbitalR: this.moonOR}
    console.log(this.planets)
  },
  mounted() {
    this.init()
    window.addEventListener('resize', this.windowResize)
  },
  methods: {
    async init() {
      this.canvas = document.getElementById('canvas')
      this.canvas.style.backgroundColor = '#000'
      this.canvas.style.cursor = 'grab'
      this.config.ctx = canvas.getContext('2d')
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.sunX = this.canvas.width / 2
      this.sunY = this.canvas.height / 2
      this.lastSunX = this.sunX
      this.lastSunY = this.sunY
      this.canvas.addEventListener('mouseleave', this.handleMouseLeave)
      this.canvas.addEventListener('mousedown', this.handleMouseDown)
      this.canvas.addEventListener('mouseup', this.handleMouseUp)
      this.canvas.addEventListener('mousemove', this.handleMouseMove)
      this.canvas.addEventListener('wheel', this.canvasScale)
      await this.loadImgs('sun', 60)
      await this.loadImgs('earth', 1)
      await this.loadImgs('moon', 1)
      await this.loadImgs('mercury', 1)
      await this.loadImgs('venus', 1)
      await this.loadImgs('mars', 1)
      await this.loadImgs('jupiter', 1)
      await this.loadImgs('saturn', 1)
      this.draw()
    },
    draw() {
      this.config.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const sun = new Planet(this.planets.sun,{x: this.sunX, y: this.sunY},this.config)
      const mercury = new Planet(this.planets.mercury,sun,this.config)
      const venus = new Planet(this.planets.venus,sun,this.config)
      const earth = new Planet(this.planets.earth,sun,this.config)
      if(performance.now()<20) { console.log('earth:',earth)}
      this.planets.moon.r = earth.r / 3.67 / this.config.rRate
      const moon = new Planet(this.planets.moon,earth,this.config)
      if(performance.now()<20) { console.log('moon:',moon)}
      const mars = new Planet(this.planets.mars,sun,this.config)
      const jupiter = new Planet(this.planets.jupiter,sun,this.config)
      const saturn = new Planet(this.planets.saturn,sun,this.config)
      const uranus = new Planet(this.planets.uranus,sun,this.config)
      const neptune = new Planet(this.planets.neptune,sun,this.config)
      requestAnimationFrame(this.draw)
    },
    
    

    // 加载图片方法
    async loadImgs(name, count) {
      // 将'../../public/planet/sun'一组的图片共23张加载到this.imgs.sun对象中
      for (let i = 1; i <= count; i++) {
        const img = new Image()
        img.src = `../../public/planet/${name}/${i}.png`
        this.imgs[name][i-1] = img
      }
      return Promise.all(Object.values(this.imgs[name]).map(img => new Promise(resolve => {
          img.onload = () => {
            resolve()
          }
          img.onerror = () => {
            console.error(`Failed to load sun.png`)
            resolve() // 继续加载其他图片
          }
        }))).then(() => {
          console.log('Sun images loaded:', this.imgs[name])
        })
    },
    async loadSunImages() {
      // 将'../../public/planet/sun'一组的图片共23张加载到this.imgs.sun对象中
      for (let i = 1; i <= 60; i++) {
        const img = new Image()
        img.src = `../../public/planet/sun/${i}.png`
        this.imgs.sun[i-1] = img
      }
      // console.log('this.imgs.sun:', this.imgs.sun)
      return Promise.all(Object.values(this.imgs.sun).map(img => new Promise(resolve => {
          img.onload = () => {
            resolve()
          }
          img.onerror = () => {
            console.error(`Failed to load sun.png`)
            resolve() // 继续加载其他图片
          }
        }))).then(() => {
          console.log('Sun images loaded:', this.imgs.sun)
        })
    },
    
    
    
    // 监听视窗大小变化
    windowResize() {
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
    },
    

    // 鼠标滚轮缩放太阳大小
    canvasScale(e) {
      if (e.deltaY < 0) {
        this.systemRateChange('add')
      } else {
        this.systemRateChange('sub')
      }
    },


    // ========== config参数调节 ==========
    systemRateChange(type) {
      this.config.systemRate *= 100
      if (type === 'add') {
        this.config.systemRate += 1
        // 画面比例缩放时，太阳位置也跟着缩放， 确保视窗区域不漂移
        this.sunX = this.lastSunX = this.sunX * 1.01
        this.sunY = this.lastSunY = this.sunY * 1.01
      } else if (type === 'sub' && this.config.systemRate > 1){
        this.config.systemRate -= 1
        this.sunX = this.lastSunX = this.sunX * 0.99
        this.sunY = this.lastSunY = this.sunY * 0.99
      }
      this.config.systemRate /= 100
      this.config.systemRate = Math.round(this.config.systemRate * 100) / 100
    },
    yRateChange(type) {
      this.config.yRate *= 10
      if (type === 'add' && this.config.yRate < 10) {
        this.config.yRate += 1
      } else if (type === 'sub' && this.config.yRate > 0){
        this.config.yRate -= 1
      }
      this.config.yRate /= 10
    },
    oRateChange(type) {
      this.config.oRate *= 100
      if (type === 'add' && this.config.oRate < 100) {
        this.config.oRate += 1
      } else if (type === 'sub' && this.config.oRate > 1){
        this.config.oRate -= 1
      }
      this.config.oRate /= 100
    },
    sRateChange(type) {
      if (type === 'add') {
        this.config.sRate += 1
      } else {
        this.config.sRate -= 1
      }
      console.log(this.config.sRate)
    },
    rRateChange(type) {
      this.config.rRate *= 10
      if (type === 'add' && this.config.rRate < 100) {
        this.config.rRate += 1
      } else if (type === 'sub' && this.config.rRate > 1){
        this.config.rRate -= 1
      }
      this.config.rRate /= 10
    },

    // ========== 鼠标拖拽 ==========
    handleMouseDown(e) {
      this.isMouseDown = true
      this.startX = e.clientX
      this.startY = e.clientY
    },

    handleMouseUp() {
      this.isMouseDown = false
      this.lastSunX = this.sunX
      this.lastSunY = this.sunY
    },
    handleMouseLeave() {
      this.isMouseDown = false
      this.lastSunX = this.sunX
      this.lastSunY = this.sunY
    },

    handleMouseMove(e) {
      if (this.isMouseDown) {
        this.canvas.style.cursor = 'grabbing'
        let dx = e.clientX - this.startX
        let dy = e.clientY - this.startY
        this.sunX = this.lastSunX + dx
        this.sunY = this.lastSunY + dy
      } else {
        this.canvas.style.cursor = 'grab'
        // 鼠标未按下时，将太阳位置重置为初始位置
        // lastSunX = sunX
        // lastSunY = sunY
      }
    },
  },
}
</script>


<style scoped>
  .control{
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 999;
  }
  .control input{
    width: 20%;
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