# 太阳系模拟器 (Solar System Simulator)

![太阳系模拟器](https://img.shields.io/badge/Solar_System-Simulator-orange)
![Vue 3](https://img.shields.io/badge/Vue-3-green)
![Vite](https://img.shields.io/badge/Vite-latest-blue)
![Canvas](https://img.shields.io/badge/Canvas-HTML5-red)

## 项目介绍

这是一个基于Vue 3和HTML5 Canvas开发的太阳系模拟器，使用Vite作为构建工具。该项目模拟了太阳系中的行星运行轨道和相对大小，提供了可交互的用户界面，允许用户调整太阳大小、行星轨道缩放比例、行星运行速度以及行星大小缩放比例。

## 功能特点

- **真实的天文数据**：基于真实天文数据比例模拟太阳和行星的相对大小和轨道距离
- **动态太阳效果**：使用多帧图像实现太阳的动态发光效果
- **交互控制**：
  - 调整太阳大小
  - 缩放行星轨道距离
  - 控制行星运行速度
  - 调整行星显示大小
- **画布拖动**：支持鼠标拖动画布，自由探索太阳系
- **响应式设计**：自适应浏览器窗口大小变化

## 技术栈

- **Vue 3**：使用Vue 3框架和Composition API
- **Vite**：使用Vite作为构建工具
- **Canvas API**：使用HTML5 Canvas绘制太阳系
- **ES6+**：使用现代JavaScript特性

## 行星系统

模拟器包含以下天体：
- 太阳
- 水星 (Mercury)
- 金星 (Venus)
- 地球 (Earth) 及其卫星月球 (Moon)
- 火星 (Mars)
- 木星 (Jupiter)
- 土星 (Saturn)
- 天王星 (Uranus)
- 海王星 (Neptune)
- 冥王星 (Pluto)（虽然已不被视为行星，但在此模拟中仍包含）

## 如何使用

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 交互控制说明

左侧控制面板提供以下调整选项：

- **太阳大小设置**：调整太阳的显示大小
- **行星轨道缩放**：调整行星轨道的缩放比例
- **行星运行速度**：调整行星运转的速度，负值表示逆时针运动
- **行星大小缩放**：调整行星的显示大小

## 项目结构

```
solar-system/
├── public/              # 静态资源
│   └── planet/          # 行星和太阳图片
├── src/
│   ├── components/      # Vue组件
│   ├── lib/             # 工具库
│   │   └── Planet.js    # 行星类定义
│   ├── view/
│   │   └── index.vue    # 主视图组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
└── vite.config.js       # Vite配置
```

## 开发说明

### Planet类

Planet类定义了行星的基本属性和绘制方法：

- 位置坐标
- 半径
- 颜色或图片
- 轨道半径
- 旋转速度
- 是否显示轨道

### 天文比例

模拟器基于真实的天文数据进行缩放，包括：
- 一个天文单位(AU)：149,600,000千米，即地球到太阳的平均距离
- 太阳半径：696,340千米
- 各行星的相对大小和轨道距离

## License

MIT

## 作者

Laya 2025-7-24

