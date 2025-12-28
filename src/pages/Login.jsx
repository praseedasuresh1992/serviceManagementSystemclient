import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import api from "../config/axiosinstance";

const Login = () => {
     const nav=useNavigate()
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
      console.log("res:data",res.data)
      console.log("res........",res)
// Save user details in localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
     
    setMessage("Login successful!");
    // Redirection to Dashboard
       if(res.data.user.role==="admin"){
                nav("/adminDashboard")
            }
            else if(res.data.user.role==="user"){
                nav("/userDashboard")
            }
            else if(res.data.user.role==="provider"){
                nav("/providerDashboard")
            }
            else{
                nav("/login")
            }
    } catch (err) {
      console.error(err);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border">

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login
        </h2>

        {message && (
          <p className="text-center mb-3 text-red-600 font-semibold">
            {message}
          </p>
        )}

        <Form onSubmit={handleSubmit}>

          {/* Username */}
          <Form.Group className="mb-4">
            <Form.Label className="font-semibold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className="p-2"
            />
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-4">
            <Form.Label className="font-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-2"
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Button>

        </Form>

        {/* Optional Links */}
        <div className="mt-4 text-center text-sm">
          <a href="/userregistration" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;
