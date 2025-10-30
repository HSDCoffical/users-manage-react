import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!user.name || !user.email || !user.password) {
      toast.error("All fields are required!");
      return;
    }

    // Password validation: 8+ chars, 1 uppercase, 1 special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(user.password)) {
      toast.error(
        "Password must be at least 8 characters long, include 1 uppercase letter and 1 special symbol."
      );
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Registration Successful!");
    navigate("/login");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Create Account
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-blue-500"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-blue-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border rounded px-3 py-2 focus:outline-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      <p className="text-gray-500 text-sm mt-4">
        Password must be at least <b>8 characters</b>, contain{" "}
        <b>1 uppercase</b> letter, and <b>1 special symbol</b>.
      </p>
    </div>
  );
}
