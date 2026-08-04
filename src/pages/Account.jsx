import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Account() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      const response = await fetch('https://user-mgmt.2791389901.workers.dev/load-user', {
        credentials: 'include'
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('请先登录');
          navigate('/login');
          return;
        }
        throw new Error('加载用户信息失败');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error(error);
      toast.error('加载用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        avatar: user.avatar || null,
        bio: user.bio || null,
        badge: user.badge || null
      };
      const response = await fetch('https://user-mgmt.2791389901.workers.dev/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新失败');
      }
      toast.success('个人资料更新成功！');
      setEditMode(false);
      await loadUser();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('https://user-mgmt.2791389901.workers.dev/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}
    document.cookie = 'cfw_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    toast.success('已登出');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'url(/bg.jpg)'}}>
      <div className="text-white text-lg">加载中...</div>
    </div>
  );
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'url(/bg.jpg)'}}>
      <div className="text-white text-lg">未找到用户信息</div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{backgroundImage: 'url(/bg.jpg)'}}>
      <div className="w-full max-w-2xl backdrop-blur-md bg-white/30 rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
        {/* 头像和基本信息 */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=128`}
            alt="avatar"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/60 shadow-lg object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{user.username}</h1>
            <div className="flex flex-wrap gap-2 mt-1 justify-center md:justify-start">
              <span className="px-3 py-1 bg-blue-500/80 text-white text-sm rounded-full backdrop-blur-sm">角色: {user.role || '用户'}</span>
              {user.badge && <span className="px-3 py-1 bg-yellow-500/80 text-white text-sm rounded-full backdrop-blur-sm">🏅 {user.badge}</span>}
            </div>
            <p className="mt-2 text-white/90 text-sm md:text-base">{user.bio || '这个人很懒，什么都没写~'}</p>
            <p className="mt-1 text-white/70 text-xs">加入时间: {user.created_at ? new Date(user.created_at).toLocaleString() : '未知'}</p>
          </div>
        </div>

        {/* 编辑模式 */}
        {editMode && (
          <div className="mt-6 space-y-3 border-t border-white/20 pt-4">
            <input
              name="avatar"
              value={user.avatar || ''}
              onChange={handleChange}
              placeholder="头像 URL"
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="bio"
              value={user.bio || ''}
              onChange={handleChange}
              placeholder="个人简介"
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="badge"
              value={user.badge || ''}
              onChange={handleChange}
              placeholder="徽章"
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-green-500/80 backdrop-blur-sm text-white py-2 rounded-lg hover:bg-green-600/80 transition disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-white/30 backdrop-blur-sm text-white py-2 rounded-lg hover:bg-white/40 transition"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/20 pt-4">
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 transition"
            >
              编辑资料
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-red-600/80 transition ml-auto"
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
}