import { createVuetify } from 'vuetify'
import { ko, en, zhHans, zhHant, de, es, ja, fr, ru, pt } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.min.css'
// 白天主题
const myOptimizedBrightDayTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF', // 保持背景纯白，适合各种内容展示
    surface: '#FAFAFA', // 浅灰色的表面，为界面元素提供微妙的层次感
    'surface-bright': '#FFFFFF', // 亮表面色，用于强调部分界面元素
    'surface-light': '#F0F0F0', // 更浅的灰色，用于背景的轻微变化
    'surface-variant': '#E0E0E0', // 表面变体，用于区分不同的UI元素
    'on-surface-variant': '#333333', // 深色文字，确保足够的对比度
    primaryShowCard: '#E1F5FE',
    toolbar: '#E1F5FE',
    snackBar: '#AED581',
    sameSncakBar: '#FDD835',
    debugBar: '#90A4AE',
    primary: '#007BFF', // 鲜艳的蓝色，用于按钮、链接等主要元素
    'primary-darken-1': '#0056b3', // 主色的深色变体，用于按下效果等
    secondary: '#E91E63', // 明亮的粉色，增加活力
    tertiary: '#FFC107', // 添加第三色彩，提亮界面
    error: '#E53935', // 错误颜色，鲜艳但不刺眼
    info: '#29B6F6', // 信息颜色，清新的蓝色
    success: '#4CAF50', // 成功颜色，舒适的绿色
    warning: '#FFA726', // 更柔和的橙色，降低刺激性
    confirm: '#4EAF0A', // 新增确认颜色，绿色调更加鲜明
    accent: '#7C4DFF', // 新增强调色，用于特别强调
    teal: '#4DB6AC',
    mecabCardBody: '#00838F', //紫色
    mecabCardTitle: '#7C4DFF',
    mecabOther: '#424242',
    snackerBar: '#F06292',
    divider: '#E0E0E0',
    table: '#B0BEC5'
  },
  variables: {
    'border-color': '#E0E0E0', // 边框颜色，与表面变体相匹配
    'border-opacity': 0.8, // 边框不完全透明，以更好地区分元素
    'high-emphasis-opacity': 0.87, // 文字和图标的高对比度透明度
    'medium-emphasis-opacity': 0.6, // 中等强调度的透明度，用于辅助文本
    'disabled-opacity': 0.38, // 禁用状态的元素透明度
    'idle-opacity': 0.04, // 未激活元素的透明度
    'hover-opacity': 0.08, // 悬停状态的透明度增加
    'focus-opacity': 0.12, // 焦点状态的透明度
    'selected-opacity': 0.08, // 选中状态的透明度
    'activated-opacity': 0.12, // 激活状态的透明度
    'pressed-opacity': 0.12, // 按下状态的透明度
    'dragged-opacity': 0.08, // 拖拽状态的透明度
    'theme-kbd': '#F5F5F5', // 键盘快捷键背景色
    'theme-on-kbd': '#333333', // 键盘上的文字颜色
    'theme-code': '#FFF8E1', // 代码块的背景色
    'theme-on-code': '#333333', // 代码块上的文字颜色
    'warning-light-1': '#FF8A80' // 警告色的深色变体，用于交互效果
  }
}
// 暗黑主题
const myOptimizedDarkTheme = {
  dark: true,
  colors: {
    background: '#121212', // 深色背景，为暗黑模式的基础
    surface: '#1E1E1E', // 比背景稍亮的表面色，用于卡片、对话框等元素
    'surface-bright': '#252525', // 更亮的表面色，用于分层或高亮显示
    'surface-light': '#2E2E2E', // 用于创建层次感的浅色表面
    'surface-variant': '#373737', // 表面变体，增加视觉深度
    'on-surface-variant': '#E0E0E0', // 对比色，用于在深色表面上的文本或图标
    primaryShowCard: '#81C784', //浅绿色
    toolbar: '#E8F5E9',
    snackBar: '#C8E6C9',
    sameSncakBar: '#FFCC80',
    debugBar: '#FFB300',
    primary: '#B89B72', // 暗金色，提供活力和焦点
    'primary-darken-1': '#9e00c5', // 主色深色变体，用于交互效果
    secondary: '#03DAC5', // 柔和的青色，增加清新感
    tertiary: '#FFB74D', // 暖橙色，增加温暖感
    'secondary-darken-1': '#00c4a7', // 次要颜色的深色变体
    error: '#CF6679', // 错误提示，温和而非侵扰性
    info: '#81D4FA', // 信息颜色，清新的蓝色
    warning: '#FFB74D',
    confirm: '#B2FF59', // 亮绿色，用于确认操作，提供积极反馈
    accent: '#FF4081', // 强调色，用于特别注意的操作
    teal: '#A7FFEB',
    mecabCardBody: '#00838F', //紫色
    mecabCardTitle: '#2E7D32',
    mecabOther: '#424242',
    snackerBar: '#BA68C8',
    divider: '#FFF3E0',
    table: '#FFEA00'
  },
  variables: {
    'border-color': '#292929', // 边框色，确保足够的辨识度
    'border-opacity': 0.8, // 边框透明度，以融入深色主题
    'high-emphasis-opacity': 0.87, // 高对比度文本透明度
    'medium-emphasis-opacity': 0.6, // 中等强调文本透明度
    'disabled-opacity': 0.38, // 禁用状态透明度
    'idle-opacity': 0.04, // 闲置元素透明度
    'hover-opacity': 0.07, // 悬停状态透明度
    'focus-opacity': 0.12, // 焦点状态透明度
    'selected-opacity': 0.08, // 选中状态透明度
    'activated-opacity': 0.12, // 激活状态透明度
    'pressed-opacity': 0.16, // 按压状态透明度
    'dragged-opacity': 0.08, // 拖拽状态透明度
    'theme-kbd': '#616161', // 键盘快捷键背景色，深灰色
    'theme-on-kbd': '#FFFFFF', // 键盘上的文字颜色，白色
    'theme-code': '#1E1E1E', // 代码块的背景色，与表面色相近
    'theme-on-code': '#B3E5FC' // 代码块上的文字颜色，淡蓝色
  }
}
export default createVuetify({
  locale: {
    messages: { ko, en, zhHans, zhHant, de, es, ja, fr, ru, pt },
    locale: 'en',
    fallback: 'en'
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    themes: {
      light: myOptimizedBrightDayTheme,
      dark: myOptimizedDarkTheme
    }
  }
})
