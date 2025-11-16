import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      alert("Login successful");

      // Save token
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Redirect based on role
      if (res.data?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "blue" }}>
          Register
        </Link>
      </p>
    </div>
  );
}
