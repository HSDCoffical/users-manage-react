import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Account() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('sessionId') || '';

      let apiUrl = '/api/load-user';
      if (sessionId) {
        apiUrl += `?sessionId=${sessionId}`;
      }

      const response = await fetch(apiUrl, {
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
      setAvatarPreview(data.avatar || '');
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('图片大小不能超过 2MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('仅支持 JPG、PNG、WebP、GIF 格式');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setAvatarPreview(base64);
      setUser({ ...user, avatar: base64 });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        avatar: user.avatar || null,
        bio: user.bio || null,
      };

      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('sessionId') || '';
      let apiUrl = '/api/update-profile';
      if (sessionId) {
        apiUrl += `?sessionId=${sessionId}`;
      }

      const response = await fetch(apiUrl, {
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
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}
    document.cookie = 'cfw_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    toast.success('已登出');
    navigate('/login');
  };

  // 加载状态
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-white/80 text-lg animate-pulse">加载中...</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="text-white/80 text-lg">未找到用户信息</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="min-h-full flex items-center justify-center p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-md bg-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 transition-all duration-300 hover:shadow-3xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-lg">
            个人中心
          </h2>

          {/* 头像区域 */}
          <div className="flex flex-col items-center mb-6">
            <div 
              className="relative w-28 h-28 rounded-full border-4 border-white/40 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-blue-500/20"
              onClick={triggerFileInput}
            >
              <img
                src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=128`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
              {editMode && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-medium backdrop-blur-[1px]">
                  更换
                </div>
              )}
            </div>
            {editMode && (
              <div className="mt-3 text-center">
                <button
                  onClick={triggerFileInput}
                  className="text-sm text-white/80 hover:text-white underline-offset-2 hover:underline transition"
                >
                  选择新头像
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <p className="text-xs text-white/40 mt-1">支持 JPG/PNG · 最大 2MB</p>
              </div>
            )}
          </div>

          {editMode ? (
            <div className="flex flex-col gap-4">
              <input
                name="bio"
                value={user.bio || ''}
                onChange={handleChange}
                placeholder="个人简介"
                className="w-full bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-500/70 hover:bg-green-600/70 text-white font-medium py-2.5 rounded-xl backdrop-blur-sm transition disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-2.5 rounded-xl backdrop-blur-sm transition"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-white/90">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-medium">用户名</span>
                <span className="font-semibold text-white">{user.username}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-medium">简介</span>
                <span className="text-right max-w-[60%] truncate">{user.bio || '未设置'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="font-medium">角色</span>
                <span className="px-3 py-0.5 bg-blue-500/30 rounded-full text-sm">{user.role || '用户'}</span>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="w-full mt-4 bg-blue-500/70 hover:bg-blue-600/70 text-white font-medium py-2.5 rounded-xl backdrop-blur-sm transition"
              >
                编辑资料
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-red-500/60 hover:bg-red-600/70 text-white font-medium py-2.5 rounded-xl backdrop-blur-sm transition"
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
}