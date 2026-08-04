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
      const response = await fetch('https://user-mgmt.2791389901.workers.dev/login', {
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
        toast.success('登录成功！');
        navigate('/account');
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
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        登录
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="username"
          type="text"
          placeholder="用户名"
          value={input.username}
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-blue-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="密码"
          value={input.password}
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        还没有账号？{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          注册
        </a>
      </p>
    </div>
  );
}