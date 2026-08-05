import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false); // 新增记住我状态
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setDebugInfo("❌ 请求超时（10秒），请检查网络或后端");
      toast.error('请求超时，请稍后重试');
      setLoading(false);
    }, 10000);

    try {
      const url = 'https://workers-users.2791389901.workers.dev/login';
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: input.username,
          password: input.password
        }),
        credentials: 'include',
        signal: controller.signal,
      };

      setDebugInfo(`📤 请求: POST ${url}`);
      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      setDebugInfo(`📥 响应状态: ${response.status} ${response.statusText}`);
      const responseText = await response.text();
      setDebugInfo(`📄 响应体: ${responseText}`);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        setDebugInfo(`❌ 响应不是 JSON: ${responseText}`);
        toast.error('服务器返回了非 JSON 数据');
        setLoading(false);
        return;
      }

      if (response.ok) {
        // ===== 关键修改：只有勾选“记住我”时才保存到 localStorage =====
        if (rememberMe) {
          localStorage.setItem('username', input.username);
          // 也保存 sessionId（从 Cookie 中获取或从响应头获取）
          const setCookie = response.headers.get('set-cookie') || '';
          const match = setCookie.match(/cfw_session=([^;]+)/);
          if (match) {
            localStorage.setItem('sessionId', match[1]);
          }
        } else {
          // 不记住则清除之前保存的
          localStorage.removeItem('username');
          localStorage.removeItem('sessionId');
        }

        setDebugInfo(`✅ 登录成功！`);
        toast.success('登录成功！');
        navigate(`/account?username=${input.username}`);
      } else {
        setDebugInfo(`❌ 登录失败: ${data.error || '未知错误'}`);
        toast.error(data.error || `登录失败 (${response.status})`);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        setDebugInfo(`❌ 请求被中止（超时）`);
        toast.error('请求超时，请检查网络');
      } else {
        setDebugInfo(`❌ 异常: ${error.name} - ${error.message}`);
        toast.error('网络错误，请检查连接');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
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

          {/* ===== 记住我 复选框 ===== */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-sm text-white/80 cursor-pointer select-none">
              保持登录状态
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-500/80 backdrop-blur-sm text-white py-3 rounded-lg hover:bg-blue-600/80 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {debugInfo && (
          <div className="mt-4 p-3 bg-black/30 backdrop-blur-sm rounded-lg text-xs text-white break-all max-h-40 overflow-auto border border-white/20">
            <strong>🔍 调试信息:</strong>
            <pre className="mt-1 whitespace-pre-wrap">{debugInfo}</pre>
          </div>
        )}

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