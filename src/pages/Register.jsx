import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.username || !user.password) {
      toast.error("用户名和密码都是必填的！");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('注册成功！');
        navigate('/login');
      } else {
        toast.error(data.error || '注册失败');
      }
    } catch (error) {
      toast.error('网络错误，请检查连接');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 w-96 border border-white/30">
        <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-md">
          注册账号
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            placeholder="用户名"
            value={user.username}
            onChange={handleChange}
            className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="密码"
            value={user.password}
            onChange={handleChange}
            className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-500/80 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-blue-600/80 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-white/80">
          已有账号？{' '}
          <a href="/login" className="text-white hover:underline font-medium">
            登录
          </a>
        </p>
      </div>
    </div>
  );
}