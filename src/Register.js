import React, { useState } from "react";
import axios from "axios";
import api from "./api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !cpassword) {
      setMessage("All fields are required");
      setAlertType("warning");
      return;
    }
    if (password !== cpassword) {
      setMessage("Password do not match");
      setAlertType("warning");
      return;
    }
    try {
      const response = await axios.post(`${api.API_BASE_URL}/register`, {
        email,
        password,
      });
      setMessage(response.data.message);
      setAlertType("success");
      navigate("/login");
    } catch (error) {
      setMessage(error.response.data.message);
      setAlertType("danger");
    }
  };

  return (
    <div className="register-container d-flex align-items-center justify-content-center">
      <div className="register-card">
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Create Your Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={cpassword}
                onChange={(e) => setcPassword(e.target.value)}
                placeholder="*******"
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Register
            </button>
          </form>
          {message && (
            <div className={`alert alert-${alertType} mt-3`} role="alert">
              {message}
            </div>
          )}
        </div>
        <div className="card-footer text-center">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
