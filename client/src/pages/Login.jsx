import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);
      const { token } = res.data;
      const decoded = jwtDecode(token);

      if (decoded.role === "client") {
        navigate("client/portal");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
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
        className="w-full py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  </div>
  );
}
