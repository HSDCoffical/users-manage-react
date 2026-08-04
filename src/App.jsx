import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

function App() {
  return (
    <div className="relative min-h-screen">
      {/* 背景图 - 作为 img 标签加载，绝对可靠 */}
      <img 
        src="/bg.jpg" 
        alt="background" 
        className="fixed inset-0 w-full h-full object-cover -z-10"
        onError={(e) => {
          // 如果图片加载失败，显示纯色背景
          e.target.style.display = 'none';
          document.body.style.backgroundColor = '#0a1628';
        }}
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;