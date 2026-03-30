import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/axiosinstance";

const Login = () => {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("login", formData);

      console.log("res:data", res.data);
      console.log("res........", res);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful!");

      if (res.data.user.role === "admin") {
        nav("/adminDashboard");
      } else if (res.data.user.role === "user") {
        nav("/userDashboard");
      } else if (res.data.user.role === "provider") {
        nav("/providerDashboard");
      } else {
        nav("/login");
      }
    } catch (err) {
      console.error(err);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-lime-300 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border">

        <h2 className="text-3xl font-bold text-center mb-6 text-green-900">
          Login
        </h2>

        {message && (
          <p className="text-center mb-3 text-red-600 font-semibold">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

        {/* Optional Links */}
        <div className="mt-4 text-center text-sm">
          <a href="/userregistration" className="text-green-900 hover:underline">
            Create an account
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;