import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import PageTransition from "../components/PageTransition";

const Login = () => {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
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

    try{
      const response = await authService.login(formData);
      console.log("Login successful:", response);
      navigate("/member-dashboard");
    }catch(error){
      console.error("Login failed:", error);
      setError(error.response?.data?.detail || "Login failed. Please try again.");

    }finally{
      setLoading(false);
    }

    // No backend connection - just navigate
    // setTimeout(() => {
    //   setLoading(false);
    //   // Navigate based on email input
    //   if (email.toLowerCase().includes("admin")) {
    //     navigate("/admin-dashboard");
    //   } else {
    //     navigate("/member-dashboard");
    //   }
    // }, 500);
  };

  return (
    <PageTransition>
    <div className="flex min-h-screen flex-1 flex-col px-6 py-4 lg:px-8 bg-gradient-to-r from-emerald-200 to-emerald-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-20 text-center text-2xl font-bold tracking-tight text-emerald-950">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="py-12 px-4 bg-[#A1E4C0] space-y-6 rounded-md shadow-xl"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="text"
                required
                placeholder="Enter your email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-700 sm:text-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="block w-full rounded-lg bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-700 sm:text-sm"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-emerald-900 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-900">
          Not a member?{" "}
          <a href="/register" className="font-semibold text-teal-900 hover:text-teal-700">
            Sign Up
          </a>
        </p>
      </div>
    </div>
    </PageTransition>
  );
};

export default Login;




{/* <div className="flex min-h-full flex-1 flex-col px-6 py-4 lg:px-8 ">
    {/* <h1 className=" text-center text-6xl text-cyan-900 font-bold">Colpro</h1> */}
    {/* <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-20 text-center text-2xl/9 font-bold tracking-tight text-emerald-950">
        Sign in to your account
      </h2>
    </div>
    
    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form action="#" method="POST" className="py-12 px-4 bg-[#A1E4C0] space-y-6 rounded-md shadow-xl">
        <div>
          <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Email address"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-teal-900 hover:text-teal-800">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="block w-full rounded-lg bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-emerald-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Log in
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm/6 text-gray-900">
        Not a member?{' '}
        <a href="/register" className="font-semibold text-teal-900 hover:text-teal-700">
          Sign Up
        </a>
      </p>
    </div>
  </div> */} 