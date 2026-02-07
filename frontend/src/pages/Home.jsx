import React from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const Home =() => {
  return <PageTransition>
  
  <div className="bg-gradient-to-r from-emerald-200 to-emerald-900 h-screen">
        
        
        
        <div className=" flex text-center justify-center  gap-20 px-20"><h1 className="text-4xl font-bold text-emerald-900 px-20 py-8">Welcome to my App</h1></div>
        
        <div className=" flex text-center justify-center  gap-20 px-20">
        <div className="p-8  shadow-2xl rounded-2xl w-150 text-center">
    
    <div className="p-5">
      <h2 className="text-2xl font-bold ">Improving team <span className="text-teal-800">col</span>laboration</h2>
      <h2 className="text-2xl font-bold ">Increasing <span className="text-teal-800">pro</span>ductivity</h2>
      <h3 className="text-xl  py-6">Whether you’re a small team or a large organization, the platform offers tools to enhance productivity, foster collaboration, and ensure every project is on track.</h3>
    </div>

    
      <Link to="/login">
       <button className="bg-emerald-800 text-white mt-6 px-6 py-2 rounded-lg hover:bg-emerald-900 shadow-lg w-full">
        Login
      </button>
      </Link>
      
      <p className="mt-4 text-sm text-gray-700">
        If you are a new user,{' '}
        <Link to="/register" className="text-gray-800 font-medium hover:underline">
        Sign Up
        </Link>
      </p>
    </div>
        </div> 
          
        </div>

          
        </PageTransition>
};

export default Home; 