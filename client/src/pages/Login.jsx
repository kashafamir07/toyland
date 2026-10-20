import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await login(
        form.email,
        form.password
      );

      navigate(
        data.role === "admin"
          ? "/admin"
          : "/"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-cream min-h-screen flex items-center justify-center py-16 px-4">

      <div className="bg-white rounded-2xl border border-plum/5 shadow-card p-8 w-full max-w-sm">

        {/* Heading */}

        <h1 className="font-display text-2xl font-extrabold text-plum text-center mb-1">
          Welcome Back
        </h1>

        <p className="text-plum/50 text-sm text-center mb-6">
          Log in to your TOYLAND account
        </p>


        {/* Error */}

        {error && (
          <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-4">
            {error}
          </div>
        )}


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email */}

          <div>

            <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full rounded-xl border border-plum/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            />

          </div>


          {/* Password */}

          <div>

            <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="w-full rounded-xl border border-plum/10 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
            />

          </div>


          {/* Login Button */}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Logging in..."
              : "Log In"}
          </Button>

        </form>


        {/* Register */}

        <p className="text-center text-sm text-plum/50 mt-5">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-coral font-semibold hover:underline"
          >
            Sign up
          </Link>

        </p>

      </div>

    </section>
  );
}