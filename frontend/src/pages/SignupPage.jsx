import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user types
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please fill all fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const { user, token, isNew } = res.data; // ✅ destructure from backend response

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

       if (isNew) {
        navigate("/goal"); 
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("User with this email already exists.");
      } else {
        setError(err.response?.data?.message || "Signup failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl text-green-500 font-bold mb-6">Signup</h2>

        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full p-2 rounded text-white font-bold ${
            !isFormValid || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 shadow-md"
          }`}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
