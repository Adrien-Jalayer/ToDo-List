import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ConfigProvider } from 'antd';
import fa_IR from 'antd/locale/fa_IR';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider direction="rtl" locale={fa_IR}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)