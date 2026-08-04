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

  if (loading) return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="text-white/80 text-lg">加载中...</div>
    </div>
  );
  if (!user) return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="text-white/80 text-lg">未找到用户信息</div>
    </div>
  );

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 w-96 border border-white/30">
        <h2 className="text-2xl font-bold text-center mb-6 text-white drop-shadow-md">
          个人中心
        </h2>

        <div className="flex flex-col items-center mb-4">
          <div 
            className="w-24 h-24 rounded-full border-2 border-white/50 overflow-hidden cursor-pointer hover:opacity-80 transition shadow-lg"
            onClick={triggerFileInput}
          >
            <img
              src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=128`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {editMode && (
            <div className="mt-2 text-center">
              <button
                onClick={triggerFileInput}
                className="text-sm text-white/80 hover:text-white underline"
              >
                更换头像
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-xs text-white/50 mt-1">点击头像上传 · 支持 JPG/PNG</p>
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
              className="w-full bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-2">
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
        ) : (
          <div className="space-y-2 text-white/90">
            <p><b className="text-white">用户名：</b>{user.username}</p>
            <p><b className="text-white">简介：</b>{user.bio || '未设置'}</p>
            <p><b className="text-white">角色：</b>{user.role || '用户'}</p>
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-blue-600/80 transition w-full mt-4"
            >
              编辑资料
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-red-600/80 transition w-full mt-4"
        >
          登出
        </button>
      </div>
    </div>
  );
}