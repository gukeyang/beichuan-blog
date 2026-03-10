---
layout: page
title: 🌤️ 天气预报
sidebar: false
prev: false
next: false
---

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .weather-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow-x: hidden;
  }

  /* 动态背景动画 */
  .weather-container::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: move 20s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes move {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 800px;
    width: 100%;
  }

  /* 磨玻璃卡片 */
  .glass-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    padding: 40px;
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .glass-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  /* 主天气卡片 */
  .weather-main {
    text-align: center;
    color: white;
  }

  .location {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }

  .weather-icon {
    font-size: 5rem;
    margin: 20px 0;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }

  .temperature {
    font-size: 4rem;
    font-weight: 700;
    text-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }

  .condition {
    font-size: 1.4rem;
    margin-top: 10px;
    opacity: 0.95;
  }

  .feels-like {
    font-size: 1rem;
    margin-top: 8px;
    opacity: 0.8;
  }

  /* 天气详情网格 */
  .weather-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 30px;
  }

  .detail-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .detail-label {
    font-size: 0.85rem;
    opacity: 0.8;
    margin-bottom: 8px;
  }

  .detail-value {
    font-size: 1.3rem;
    font-weight: 600;
  }

  /* 加载状态 */
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* 响应式 */
  @media (max-width: 600px) {
    .glass-card {
      padding: 25px;
    }

    .location {
      font-size: 1.4rem;
    }

    .weather-icon {
      font-size: 3.5rem;
    }

    .temperature {
      font-size: 3rem;
    }

    .weather-details {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

<div class="weather-container">
  <div class="container">
    <!-- 主天气卡片 -->
    <div class="glass-card weather-main" id="weather-card">
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
        
        <div class="weather-details">
          <div class="detail-item">
            <div class="detail-label">💨 风速</div>
            <div class="detail-value" id="wind">-- km/h</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">💧 湿度</div>
            <div class="detail-value" id="humidity">--%</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">🌧️ 降水</div>
            <div class="detail-value" id="precipitation">-- mm</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">👁️ 能见度</div>
            <div class="detail-value" id="visibility">-- km</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  // 天气图标映射
  const weatherIcons = {
    'sunny': '☀️',
    'clear': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'rain': '🌧️',
    'light-rain': '🌦️',
    'heavy-rain': '⛈️',
    'thunderstorm': '⚡',
    'snow': '❄️',
    'light-snow': '🌨️',
    'heavy-snow': '❄️',
    'fog': '🌫️',
    'mist': '🌫️',
    'haze': '🌫️',
    'wind': '💨',
    'default': '🌤️'
  };

  // 获取天气数据
  async function fetchWeather() {
    try {
      // 使用 whyta.cn 天气 API
      const apiKey = '6d997a997fbf';
      const city = 'Chongqing';
      const response = await fetch(`https://whyta.cn/api/tianqi?key=${apiKey}&city=${city}`);
      
      if (!response.ok) {
        throw new Error('API 请求失败');
      }
      
      const data = await response.json();
      
      if (data.status !== 1) {
        throw new Error(data.message || 'API 返回错误');
      }
      
      const current = data.data;
      
      // 更新主天气信息
      document.getElementById('location').textContent = `📍 ${current.city}`;
      document.getElementById('weather-icon').textContent = getWeatherIcon(current.weatherDesc[0].value);
      document.getElementById('temperature').textContent = `${current.temp_C}°C`;
      document.getElementById('condition').textContent = current.weatherDesc[0].value;
      document.getElementById('feels-like').textContent = `体感温度：${current.FeelsLikeC}°C`;
      document.getElementById('wind').textContent = `${current.windspeedKmph} km/h`;
      document.getElementById('humidity').textContent = `${current.humidity}%`;
      document.getElementById('precipitation').textContent = `${current.precipMM} mm`;
      document.getElementById('visibility').textContent = `${current.visibility} km`;
      
      // 隐藏加载，显示内容
      document.getElementById('loading').style.display = 'none';
      document.getElementById('weather-content').style.display = 'block';
      
    } catch (error) {
      console.error('获取天气失败:', error);
      fetchWeatherFallback();
    }
  }

  // 降级方案：wttr.in API
  async function fetchWeatherFallback() {
    try {
      const response = await fetch('https://wttr.in/Chongqing?format=j1');
      const data = await response.json();
      
      const current = data.current_condition[0];
      const location = data.nearest_area[0];
      
      document.getElementById('location').textContent = `📍 ${location.areaName[0].value}，${location.country[0].value}`;
      document.getElementById('weather-icon').textContent = getWeatherIcon(current.weatherDesc[0].value);
      document.getElementById('temperature').textContent = `${current.temp_C}°C`;
      document.getElementById('condition').textContent = current.weatherDesc[0].value;
      document.getElementById('feels-like').textContent = `体感温度：${current.FeelLikeC}°C`;
      document.getElementById('wind').textContent = `${current.windspeedKmph} km/h`;
      document.getElementById('humidity').textContent = `${current.humidity}%`;
      document.getElementById('precipitation').textContent = `${current.chanceofrain}%`;
      document.getElementById('visibility').textContent = `${current.visibility} km`;
      
      document.getElementById('loading').style.display = 'none';
      document.getElementById('weather-content').style.display = 'block';
      
    } catch (error) {
      console.error('备用 API 也失败:', error);
      document.getElementById('loading').innerHTML = '<p>获取天气数据失败，请稍后刷新</p>';
    }
  }

  // 获取天气图标
  function getWeatherIcon(desc) {
    const lower = desc.toLowerCase();
    for (const [key, icon] of Object.entries(weatherIcons)) {
      if (lower.includes(key)) return icon;
    }
    return weatherIcons.default;
  }

  // 页面加载时获取天气
  fetchWeather();
  
  // 每 30 分钟刷新一次
  setInterval(fetchWeather, 30 * 60 * 1000);
</script>
