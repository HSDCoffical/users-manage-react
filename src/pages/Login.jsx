import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: input.username,
          password: input.password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        const setCookie = response.headers.get('set-cookie') || '';
        const match = setCookie.match(/cfw_session=([^;]+)/);
        const sessionId = match ? match[1] : '';

        toast.success('登录成功！');
        navigate(`/account?sessionId=${sessionId}`);
      } else {
        toast.error(data.error || '登录失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: 'url(/bg.jpg)' }}>
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 w-96 border border-white/30">
        <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-md">
          登录
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="用户名"
            value={input.username}
            onChange={handleChange}
            className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="密码"
            value={input.password}
            onChange={handleChange}
            className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-500/80 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-blue-600/80 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-white/80">
          还没有账号？{' '}
          <a href="/register" className="text-white hover:underline font-medium">
            注册
          </a>
        </p>
      </div>
    </div>
  );
}