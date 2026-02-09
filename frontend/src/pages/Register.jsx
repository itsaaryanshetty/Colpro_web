import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import PageTransition from "../components/PageTransition";
import { User, Mail, Lock, Check, ArrowRight } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'Member' // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.signup(formData);
      console.log("Registration successful:", response);
      navigate("/member-dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-950 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[100px] animate-blob"></div>
          <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Join <span className="text-emerald-400 font-semibold">Colpro</span> to manage projects efficiently
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-900/50 backdrop-blur-md py-8 px-8 shadow-2xl rounded-2xl border border-slate-800">
            <form className="space-y-5" onSubmit={handleSubmit}>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-slate-300">
                    First Name
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      placeholder="John"
                      className="block w-full rounded-xl border-0 bg-slate-800/50 py-2.5 pl-9 pr-3 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-slate-300">
                    Last Name
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      placeholder="Doe"
                      className="block w-full rounded-xl border-0 bg-slate-800/50 py-2.5 pl-9 pr-3 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                </div>
              </div>

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
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="block w-full rounded-xl border-0 bg-slate-800/50 py-2.5 pl-10 pr-3 text-white shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-300">
                  Password
                </label>
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

              <div className="pt-2">
                <span className="block text-sm font-medium text-slate-300 mb-2">
                  I am a...
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.role === "Member" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"}`}>
                    <input
                      type="radio"
                      name="role"
                      value="Member"
                      checked={formData.role === "Member"}
                      onChange={() => setFormData({ ...formData, role: "Member" })}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      {formData.role === "Member" && <Check size={16} />}
                      <span className="font-medium">Member</span>
                    </div>
                  </label>

                  <label className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.role === "Admin" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800"}`}>
                    <input
                      type="radio"
                      name="role"
                      value="Admin"
                      checked={formData.role === "Admin"}
                      onChange={() => setFormData({ ...formData, role: "Admin" })}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      {formData.role === "Admin" && <Check size={16} />}
                      <span className="font-medium">Admin</span>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:from-emerald-400 hover:to-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                >
                  {loading ? "Creating account..." : "Create Account"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold leading-6 text-emerald-400 hover:text-emerald-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;