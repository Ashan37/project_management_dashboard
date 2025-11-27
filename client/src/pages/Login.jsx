import { useState, useEffect } from "react";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login, token, role } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (token && role) {
      if (role === "client") {
        navigate("/client/portal", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [token, role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      const { token, user } = res.data;
      
      if (!token) {
        throw new Error("No token received from server");
      }

      const decoded = jwtDecode(token);
      
      // Store authentication data
      login(user, token);
      localStorage.setItem('token', token);

      // Navigate based on role
      if (decoded.role === "client") {
        navigate("/client/portal");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 bg-white shadow-md rounded-xl"
    >
      <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded"
        onChange={handleChange}
      ></input>
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded"
        onChange={handleChange}
      ></input>
      <button
        type="submit"
        className="w-full py-3 text-white bg-[#82BAC4] rounded hover:bg-[#6DA8B3]"
      >
        Login
      </button>
    </form>
  </div>
  );
}
