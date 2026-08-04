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

    // 清空旧日志
    console.clear();
    console.log('=== 登录请求开始 ===');

    try {
      const url = 'https://user-mgmt.2791389901.workers.dev/login';
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: input.username,
          password: input.password
        }),
        credentials: 'include'
      };

      console.log('请求 URL:', url);
      console.log('请求参数:', options);

      const response = await fetch(url, options);

      console.log('响应状态:', response.status, response.statusText);
      console.log('响应头:', [...response.headers.entries()]);

      // 尝试获取响应文本（用于调试）
      const responseText = await response.text();
      console.log('原始响应体:', responseText);

      // 解析 JSON（如果可能）
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('响应体不是有效的 JSON:', responseText);
        toast.error('服务器返回了非 JSON 数据，请检查后端');
        setLoading(false);
        return;
      }

      if (response.ok) {
        // 从响应头提取 sessionId
        const setCookie = response.headers.get('set-cookie') || '';
        const match = setCookie.match(/cfw_session=([^;]+)/);
        const sessionId = match ? match[1] : '';

        console.log('登录成功，sessionId:', sessionId);
        toast.success('登录成功！');
        navigate(`/account?sessionId=${sessionId}`);
      } else {
        console.error('登录失败，后端返回:', data);
        toast.error(data.error || `登录失败 (${response.status})`);
      }
    } catch (error) {
      console.error('=== 网络/程序异常 ===');
      console.error('错误类型:', error.name);
      console.error('错误信息:', error.message);
      console.error('完整错误对象:', error);
      toast.error('网络错误，请检查连接或查看控制台');
    } finally {
      setLoading(false);
      console.log('=== 登录请求结束 ===');
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