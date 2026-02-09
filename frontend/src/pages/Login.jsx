import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import PageTransition from "../components/PageTransition";
import { Lock, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log("Login successful:", response);
      navigate("/member-dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-950 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Welcome back to <span className="text-emerald-400">Colpro</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to access your workspace
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-md py-8 px-8 shadow-2xl rounded-2xl border border-slate-800">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-300">
                  Email address
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="text" // changed from email to text as per original but 'email' type is better for validation
                    required
                    placeholder="name@company.com"
                    className="block w-full rounded-xl border-0 bg-slate-800/50 py-2.5 pl-10 pr-3 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-300">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="block w-full rounded-xl border-0 bg-slate-800/50 py-2.5 pl-10 pr-3 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:from-emerald-400 hover:to-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                >
                  {loading ? "Signing in..." : "Sign in"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Not a member?{" "}
              <Link to="/register" className="font-semibold leading-6 text-emerald-400 hover:text-emerald-300 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;