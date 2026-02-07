import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import PageTransition from "../components/PageTransition";


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

    try{
      const response = await authService.signup(formData);
      console.log("Registration successful:", response);
      navigate("/member-dashboard");
    }catch(error){
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    }finally{
      setLoading(false);
    }

    // // Simulate registration without backend
    // setTimeout(() => {
    //   setLoading(false);
    //   navigate("/login");
    // }, 500);
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-r from-emerald-200 to-emerald-900">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-emerald-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit}
            className="py-7 px-4 bg-[#A1E4C0] space-y-6 rounded-md shadow-xl"
          >
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  placeholder="Enter your first name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-700 sm:text-sm"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-900">
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  placeholder="Enter your last name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-700 sm:text-sm"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
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
                  autoComplete="current-password"
                  placeholder="Password"
                  className="block w-full rounded-lg bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-700 sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-4">
              <span className="block text-sm font-medium text-gray-900 mb-2">
                Select Role
              </span>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={formData.role}
                    checked={formData.role === "Admin"}
                    onChange={() => setFormData({...formData, role: "Admin"})}
                    className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-600"
                  />
                  <span className="ml-2 text-gray-700">Admin</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={formData.role}
                    checked={formData.role === "Member"}
                    onChange={() => setFormData({...formData, role: "Member"})}
                    className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-600"
                  />
                  <span className="ml-2 text-gray-700">Member</span>
                </label>
              </div>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-emerald-800 px-3 py-1.5 
                text-sm font-semibold text-white shadow hover:bg-cyan-900 
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-60"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Register;









{/* <div className="min-h-screen bg-gradient-to-r from-emerald-200 to-emerald-900 background-blend-difference">
    
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8 ">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-emerald-900">
      Sign Up
      </h2>
    </div>
  
    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form action="#" method="POST" className="py-7 px-4 bg-[#A1E4C0] space-y-6 rounded-md shadow-xl">
        <div>
          <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
            Username
          </label>
          <div className="mt-2">
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Enter your username"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
  
        </div>
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
              placeholder="Enter your email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
  
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="password"
              className="block w-full rounded-lg bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
  
        <div className="mt-4">
  <span className="block text-sm font-medium text-gray-900 mb-2">
    Select Role
  </span>
  <div className="flex items-center space-x-4">
    <label className="flex items-center">
      <input
        type="radio"
        name="role"
        value="ADMIN"
        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-600"
      />
      <span className="ml-2 text-gray-700">Admin</span>
    </label>
  
    <label className="flex items-center">
      <input
        type="radio"
        name="role"
        value="MEMBER"
        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-indigo-600"
      />
      <span className="ml-2 text-gray-700">Member</span>
    </label>
    </div>
    </div>
        
  
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-emerald-800 px-3 py-1.5 
            text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-900 
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Sign Up
          </button>
        </div>
      </form>
  
      
    </div>
  </div>
  </div> */}