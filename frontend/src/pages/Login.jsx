import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";
const BACKEND_URL = import.meta.env.VITE_SERVER_URL;
export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  // google
  const handleGoogle = () => {  
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };
  // github
  const handleGitHub = () => {
    window.location.href = `${BACKEND_URL}/api/auth/github`;
  };
  const submit = async (e) => {
    e.preventDefault();
    await login(email, password);
    nav("/");
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h3 className="mt-4 mb-3">Login</h3>
      <form onSubmit={submit}>
        <input
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="mt-2">
        No account? <Link to="/register">Register</Link>
      </p>
      <button onClick={handleGoogle} className="btn btn-danger w-100 mt-2"><i className="bi bi-google me-2"></i> Continue with Google</button>
      <button onClick={handleGitHub} className="btn btn-dark w-100 mt-2"> <i className="bi bi-github me-2"></i> Continue with GitHub</button>
    </div>
  );
}
