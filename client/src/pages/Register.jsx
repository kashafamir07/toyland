import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import { useSearchParams } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  const [searchParams] = useSearchParams();
const redirect = searchParams.get("redirect");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (form.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }
  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return;
  }
  setLoading(true);
  try {
    const data = await register(form.name, form.email, form.password, form.phone);
    navigate(data.role === "admin" ? "/admin" : redirect || "/");
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};
    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.phone);
      navigate(data.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-cream min-h-screen flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl border border-plum/5 shadow-card p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-3xl">🧸</span>
          <h1 className="font-display text-2xl font-extrabold text-plum mt-2 mb-1">
            Join TOYLAND
          </h1>
          <p className="text-plum/50 text-sm">Create an account to start shopping</p>
        </div>

        {error && (
          <div className="bg-coral/10 text-coral text-sm rounded-xl px-4 py-2.5 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="03XX-XXXXXXX"
              className="input"
            />
          </div>

          <div>
            <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="input"
            />
            <p className="text-[11px] text-plum/40 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label className="text-xs font-display font-bold text-plum/60 mb-1.5 block">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="input"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-plum/50 mt-5">
          Already have an account?{" "}
          <Link to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-coral font-semibold hover:underline">
  Log in
</Link>
          
        </p>
      </div>
    </section>
  ); 
}