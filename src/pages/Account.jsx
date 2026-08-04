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
    } catch (e) {
      // ignore
    }
    document.cookie = 'cfw_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    toast.success('已登出');
    navigate('/login');
  };

  if (loading) return <div className="text-center py-8">加载中...</div>;
  if (!user) return <div className="text-center py-8">未找到用户信息</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        个人中心
      </h2>

      {editMode ? (
        <div className="flex flex-col gap-4">
          <input
            name="avatar"
            value={user.avatar || ''}
            onChange={handleChange}
            placeholder="头像 URL"
            className="border rounded px-3 py-2 focus:outline-blue-500"
          />
          <input
            name="bio"
            value={user.bio || ''}
            onChange={handleChange}
            placeholder="个人简介"
            className="border rounded px-3 py-2 focus:outline-blue-500"
          />
          <input
            name="badge"
            value={user.badge || ''}
            onChange={handleChange}
            placeholder="徽章"
            className="border rounded px-3 py-2 focus:outline-blue-500"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
          >
            取消
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p><b>用户名：</b>{user.username}</p>
          <p><b>头像：</b>{user.avatar || '未设置'}</p>
          <p><b>简介：</b>{user.bio || '未设置'}</p>
          <p><b>徽章：</b>{user.badge || '未设置'}</p>
          <p><b>角色：</b>{user.role}</p>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full mt-4"
          >
            编辑资料
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition w-full mt-4"
      >
        登出
      </button>
    </div>
  );
}