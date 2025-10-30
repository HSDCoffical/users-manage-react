import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white py-3 shadow-md">
      <div className="container mx-auto flex justify-center gap-8">
        <Link to="/register" className="hover:underline">
          Register
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link to="/account" className="hover:underline">
          Account
        </Link>
      </div>
    </nav>
  );
}
