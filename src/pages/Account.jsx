import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Account() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const fetchUser = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    fetchUser(); // refresh data
    setEditMode(false);
    toast.success("Account updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    toast.success("Logged out!");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        My Account
      </h2>

      {editMode ? (
        <div className="flex flex-col gap-4">
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-blue-500"
          />
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-blue-500"
          />
          <input
            name="password"
            value={user.password}
            onChange={handleChange}
            className="border rounded px-3 py-2 focus:outline-blue-500"
          />
          <button
            onClick={handleSave}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <b>Name:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Password:</b> {user.password}
          </p>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full mt-4"
          >
            Edit
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition w-full mt-4"
      >
        Logout
      </button>
    </div>
  );
}
