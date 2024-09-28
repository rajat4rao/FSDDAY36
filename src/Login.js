import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api.API_BASE_URL}/login`, {
        email,
        password,
      });
      setMessage(response.data.message);
      setAlertType("success");
      navigate("/");
    } catch (error) {
      setMessage(error.response.data.message);
      setAlertType("danger");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-3">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
              {message && (
                <div className={`alert alert-${alertType} mt-3`} role="alert">
                  {message}
                </div>
              )}
              <p className="mt-3 text-center link">
                <Link to="/forgot-password">forgot password</Link>
              </p>
            </div>
            <div className="card-footer">
              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <Link to="/register" className="link">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
