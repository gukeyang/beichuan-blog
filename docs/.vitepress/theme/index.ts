import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './index.css'

export default {
  extends: DefaultTheme,
  setup() {
    // 注册全局鼠标移动事件，用于 CSS 光影效果
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', (e) => {
        const x = e.clientX
        const y = e.clientY
        // 更新 CSS 变量，供全局样式使用
        document.documentElement.style.setProperty('--mouse-x', `${x}px`)
        document.documentElement.style.setProperty('--mouse-y', `${y}px`)
      })
    }
  }
} satisfies Theme
