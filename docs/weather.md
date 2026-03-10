---
layout: page
title: 🌤️ 天气预报
sidebar: false
prev: false
next: false
---

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
.weather-page { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); display: flex; justify-content: center; align-items: center; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.glass-card { background: rgba(255,255,255,0.15); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.2); padding: 40px; max-width: 800px; width: 100%; text-align: center; color: white; }
.location { font-size: 1.8rem; font-weight: 600; margin-bottom: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }
.weather-icon { font-size: 5rem; margin: 20px 0; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
.temperature { font-size: 4rem; font-weight: 700; text-shadow: 0 4px 15px rgba(0,0,0,0.3); }
.condition { font-size: 1.4rem; margin-top: 10px; opacity: 0.95; }
.feels-like { font-size: 1rem; margin-top: 8px; opacity: 0.8; }
.weather-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-top: 30px; }
.grid-item { background: rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.15); }
.grid-label { font-size: 0.85rem; opacity: 0.8; margin-bottom: 8px; }
.grid-value { font-size: 1.3rem; font-weight: 600; }
.loading { display: flex; flex-direction: column; align-items: center; gap: 15px; }
.spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 600px) { .glass-card { padding: 25px; } .location { font-size: 1.4rem; } .weather-icon { font-size: 3.5rem; } .temperature { font-size: 3rem; } .weather-grid { grid-template-columns: repeat(2, 1fr); } }
</style>

<script setup>
import { onMounted } from 'vue'

const weatherIcons = {
  晴：'☀️', 晴间多云：'⛅', 多云：'☁️', 阴：'☁️', 阵雨：'🌦️',
  雷阵雨：'⛈️', 雨：'🌧️', 小雨：'🌦️', 中雨：'🌧️', 大雨：'⛈️',
  暴雨：'⛈️', 雪：'❄️', 小雪：'🌨️', 中雪：'❄️', 大雪：'❄️',
  雾：'🌫️', 霾：'🌫️', 扬沙：'🌫️', 浮尘：'🌫️', 沙尘暴：'🌫️',
  默认：'🌤️'
}

const getWeatherIcon = (desc) => {
  if (!desc) return weatherIcons['默认']
  for (const [key, icon] of Object.entries(weatherIcons)) {
    if (desc.includes(key)) return icon
  }
  return weatherIcons['默认']
}

const fetchWeather = async () => {
  if (typeof document === 'undefined') return
  try {
    const key = 'ef5e927e2dae61851e920eb74987fd81'
    const city = '500106'
    const response = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&extensions=base&output=JSON&key=${key}`)
    if (!response.ok) throw new Error('API 请求失败')
    const data = await response.json()
    if (data.status !== '1') throw new Error(data.info || 'API 返回错误')
    const live = data.lives[0]
    if (!live) throw new Error('无天气数据')
    document.getElementById('location').textContent = '📍 ' + live.city
    document.getElementById('weather-icon').textContent = getWeatherIcon(live.weather)
    document.getElementById('temperature').textContent = live.temperature + '°C'
    document.getElementById('condition').textContent = live.weather
    document.getElementById('feels-like').textContent = '体感温度：' + live.temperature + '°C'
    document.getElementById('wind').textContent = live.winddirection + '风 ' + live.windpower + '级'
    document.getElementById('humidity').textContent = live.humidity + '%'
    document.getElementById('precipitation').textContent = '--'
    document.getElementById('visibility').textContent = '--'
    document.getElementById('loading').style.display = 'none'
    document.getElementById('weather-content').style.display = 'block'
  } catch (e) {
    console.error('天气获取失败:', e)
    if (typeof document !== 'undefined') {
      document.getElementById('loading').innerHTML = '<p>获取天气失败：' + e.message + '</p><p style="margin-top:10px;opacity:0.8">请刷新重试</p>'
    }
  }
}

onMounted(() => {
  fetchWeather()
  setInterval(fetchWeather, 1800000)
})
</script>

<div class="weather-page">
  <div class="glass-card">
    <div class="loading" id="loading">
      <div class="spinner"></div>
      <p>正在获取天气数据...</p>
    </div>
    <div id="weather-content" style="display: none;">
      <div class="location" id="location">📍 重庆</div>
      <div class="weather-icon" id="weather-icon">⛅</div>
      <div class="temperature" id="temperature">--°C</div>
      <div class="condition" id="condition">--</div>
      <div class="feels-like" id="feels-like">体感温度：--°C</div>
      <div class="weather-grid">
        <div class="grid-item">
          <div class="grid-label">💨 风向风力</div>
          <div class="grid-value" id="wind">--</div>
        </div>
        <div class="grid-item">
          <div class="grid-label">💧 湿度</div>
          <div class="grid-value" id="humidity">--%</div>
        </div>
        <div class="grid-item">
          <div class="grid-label">🌧️ 降水</div>
          <div class="grid-value" id="precipitation">--</div>
        </div>
        <div class="grid-item">
          <div class="grid-label">👁️ 能见度</div>
          <div class="grid-value" id="visibility">--</div>
        </div>
      </div>
    </div>
  </div>
</div>
