---
layout: page
title: 🌤️ 天气预报
sidebar: false
prev: false
next: false
---

<style>
.weather-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
}

.weather-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
  animation: move 20s linear infinite;
}

@keyframes move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(30px, 30px); }
}

.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  padding: 48px;
  max-width: 700px;
  width: 100%;
  text-align: center;
  color: white;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.location {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.5px;
}

.weather-icon {
  font-size: 6rem;
  margin: 16px 0;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.temperature {
  font-size: 5rem;
  font-weight: 700;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  line-height: 1;
  margin: 8px 0;
}

.condition {
  font-size: 1.5rem;
  margin-top: 8px;
  opacity: 0.95;
  font-weight: 400;
}

.feels-like {
  font-size: 1rem;
  margin-top: 12px;
  opacity: 0.8;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: inline-block;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.grid-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: background 0.3s ease, transform 0.3s ease;
}

.grid-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.grid-label {
  font-size: 0.8rem;
  opacity: 0.75;
  margin-bottom: 8px;
  font-weight: 400;
}

.grid-value {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 0;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  font-size: 1rem;
  opacity: 0.85;
}

.update-time {
  margin-top: 24px;
  font-size: 0.85rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .glass-card {
    padding: 32px 24px;
  }
  .location {
    font-size: 1.6rem;
  }
  .weather-icon {
    font-size: 4.5rem;
  }
  .temperature {
    font-size: 3.5rem;
  }
  .condition {
    font-size: 1.2rem;
  }
  .weather-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 32px;
    padding-top: 24px;
  }
  .grid-item {
    padding: 16px 12px;
  }
  .grid-value {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .weather-page {
    padding: 16px;
  }
  .glass-card {
    padding: 24px 20px;
    border-radius: 24px;
  }
  .temperature {
    font-size: 3rem;
  }
}
</style>

<script setup>
import { onMounted, ref } from 'vue'

const weatherIcons = {
  '晴': '☀️', '晴间多云': '⛅', '多云': '☁️', '阴': '☁️', '阵雨': '🌦️',
  '雷阵雨': '⛈️', '雨': '🌧️', '小雨': '🌦️', '中雨': '🌧️', '大雨': '⛈️',
  '暴雨': '⛈️', '雪': '❄️', '小雪': '🌨️', '中雪': '❄️', '大雪': '❄️',
  '雾': '🌫️', '霾': '🌫️', '扬沙': '🌫️', '浮尘': '🌫️', '沙尘暴': '🌫️',
  '默认': '🌤️'
}

const loading = ref(true)
const error = ref(null)
const weatherData = ref(null)

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
    
    weatherData.value = {
      city: live.city,
      weather: live.weather,
      temperature: live.temperature,
      winddirection: live.winddirection,
      windpower: live.windpower,
      humidity: live.humidity,
      reporttime: live.reporttime
    }
    loading.value = false
  } catch (e) {
    console.error('天气获取失败:', e)
    error.value = e.message
    loading.value = false
  }
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return timeStr.replace(/-/g, '/').replace(' ', ' ')
}

onMounted(() => {
  fetchWeather()
  setInterval(fetchWeather, 1800000)
})
</script>

<template>
<div class="weather-page">
  <div class="glass-card">
    <template v-if="loading">
      <div class="loading">
        <div class="spinner"></div>
        <p>正在获取天气数据...</p>
      </div>
    </template>
    <template v-else-if="error">
      <div class="loading">
        <div style="font-size: 4rem; margin-bottom: 16px;">😕</div>
        <p style="font-size: 1.1rem; margin-bottom: 8px;">获取天气失败</p>
        <p style="opacity: 0.7; font-size: 0.9rem;">{{ error }}</p>
        <p style="margin-top: 16px; opacity: 0.6; font-size: 0.85rem;">请刷新页面重试</p>
      </div>
    </template>
    <template v-else-if="weatherData">
      <div class="location">📍 {{ weatherData.city }}</div>
      <div class="weather-icon">{{ getWeatherIcon(weatherData.weather) }}</div>
      <div class="temperature">{{ weatherData.temperature }}°C</div>
      <div class="condition">{{ weatherData.weather }}</div>
      <div class="feels-like">🌡️ 体感相似温度</div>
      
      <div class="weather-grid">
        <div class="grid-item">
          <div class="grid-label">💨 风向</div>
          <div class="grid-value">{{ weatherData.winddirection }}风</div>
        </div>
        <div class="grid-item">
          <div class="grid-label">🍃 风力</div>
          <div class="grid-value">{{ weatherData.windpower }}级</div>
        </div>
        <div class="grid-item">
          <div class="grid-label">💧 湿度</div>
          <div class="grid-value">{{ weatherData.humidity }}%</div>
        </div>
        <div class="grid-item">
          <div class="grid-label">📅 更新</div>
          <div class="grid-value" style="font-size: 0.9rem;">{{ weatherData.reporttime?.split(' ')[1]?.slice(0, 5) || '--:--' }}</div>
        </div>
      </div>
      
      <div class="update-time" v-if="weatherData.reporttime">
        数据更新于 {{ weatherData.reporttime }}
      </div>
    </template>
  </div>
</div>
</template>
