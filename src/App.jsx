import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';

function App() {
  return (
    <div className="relative min-h-screen">
      {/* 背景图：居中裁剪，固定定位 */}
      <img 
        src="/bg.jpg" 
        alt="background" 
        className="fixed inset-0 w-full h-full object-cover object-center -z-10"
        onError={(e) => {
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