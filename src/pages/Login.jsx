import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDebugInfo("⏳ 正在发送请求...");

    try {
      // 改为相对路径，走 Pages Functions 代理
      const url = '/api/login';
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: input.username,
          password: input.password
        }),
        credentials: 'include'
      };

      setDebugInfo(`📤 请求: POST ${url}`);

      const response = await fetch(url, options);

      setDebugInfo(`📥 响应状态: ${response.status} ${response.statusText}`);

      const responseText = await response.text();
      setDebugInfo(`📄 响应体: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        setDebugInfo(`❌ 响应不是 JSON: ${responseText.substring(0, 100)}`);
        toast.error('服务器返回了非 JSON 数据');
        setLoading(false);
        return;
      }

      if (response.ok) {
        const setCookie = response.headers.get('set-cookie') || '';
        const match = setCookie.match(/cfw_session=([^;]+)/);
        const sessionId = match ? match[1] : '';

        setDebugInfo(`✅ 登录成功! sessionId: ${sessionId.substring(0, 20)}...`);
        toast.success('登录成功！');
        navigate(`/account?sessionId=${sessionId}`);
      } else {
        setDebugInfo(`❌ 登录失败: ${data.error || '未知错误'}`);
        toast.error(data.error || `登录失败 (${response.status})`);
      }
    } catch (error) {
      setDebugInfo(`❌ 异常: ${error.name} - ${error.message}`);
      toast.error('网络错误，请检查连接或查看下方调试信息');
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

      {debugInfo && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-700 break-all max-h-40 overflow-auto border border-gray-200">
          <strong>🔍 调试信息:</strong>
          <pre className="mt-1 whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-gray-600">
        还没有账号？{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          注册
        </a>
      </p>
    </div>
  );
}