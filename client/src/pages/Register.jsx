import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/api/user/register", {
        name,
        email,
        password,
      });
      console.log(data)
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* Top Navbar */}
      <nav className="w-full p-4 shadow-md flex justify-between items-center bg-white">
        <h1 className="text-2xl font-bold text-indigo-800">Project Buddy</h1>
        <Link
          to="/"
          className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-center items-stretch min-h-[80vh]">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 p-14 bg-slate-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-indigo-900">Create your account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Himanshu Raj"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-800"
              />
            </div>
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
                placeholder="himanshu@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-800"
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
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-800"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-800 text-white py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-800 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 bg-indigo-100 p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-indigo-900">Welcome to Project Buddy</h1>
          <p className="text-md leading-relaxed text-gray-700">
            Connect with passionate developers, share your ideas, and build something amazing—together.
            Whether you're looking to join a team or find collaborators for your next big project, you're in the right place.
          </p>
        </div>
      </div>

      <ToastContainer />
    </div>

  );
};

export default Register;
