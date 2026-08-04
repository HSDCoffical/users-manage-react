import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 强制背景样式（使用在线图片，避免本地图片问题）
const style = document.createElement('style');
style.textContent = `
  body {
    background-image: url('https://picsum.photos/1920/1080?random=1') !important;
    background-size: cover !important;
    background-position: center !important;
    background-attachment: fixed !important;
    min-height: 100vh !important;
    margin: 0 !important;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)