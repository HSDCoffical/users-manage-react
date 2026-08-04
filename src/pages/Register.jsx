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
      const response = await fetch('https://user-mgmt.2791389901.workers.dev/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('注册成功！');
        navigate('/login');
      } else {
        toast.error(data.error || '注册失败，请稍后重试');
      }
    } catch (error) {
      toast.error('网络错误，请检查连接');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        注册账号
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          placeholder="用户名"
          value={user.username}
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-blue-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="密码"
          value={user.password}
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        已有账号？{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          登录
        </a>
      </p>
    </div>
  );
}