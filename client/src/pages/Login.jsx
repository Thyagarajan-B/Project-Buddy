import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/api/user/login", {
        email,
        password,
      });

      if (data.success) {
        login(data.user, data.token);
        navigate("/");
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", token);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* Navbar */}
      <nav className="w-full p-4 shadow-md flex justify-between items-center bg-white">
        <h1 className="text-xl font-bold text-indigo-800">Project Buddy</h1>
        <Link
          to="/"
          className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Home
        </Link>
      </nav>

      {/* Login Section */}
      <div className="flex justify-center items-center min-h-[80vh] bg-slate-100 px-4">
        <div className="bg-white shadow-md p-8 rounded-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-900">Welcome back!</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-800"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-800"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-800 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-800 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>

  );
};

export default Login;
