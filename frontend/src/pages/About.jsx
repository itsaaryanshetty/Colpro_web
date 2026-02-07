import React from "react";
import Colprous from '../assets/Colprous.jpeg';
import PageTransition from "../components/PageTransition";


import { FaLinkedin, FaWhatsapp, FaGithub, FaInstagram } from "react-icons/fa";



import Header from "../components/Header";
import { Link } from "react-router-dom";


const About =()=> {
    return (
    <PageTransition>
    <div>
      
        
        <div className="flex h-screen bg-emerald-100">
        <div className="flex-1 p-15">
          <h1 className="text-4xl font-bold">About Us</h1>
          <p className="mt-4 text-2xl py-5 space-y-20">
            Welcome to my platform. 
            You can check my Github for the projects i have done and approach me through Whatsapp/ Linkedin/ Instagram. 
            If you are still wondering why Colpro, the name comes from Improving team <span className=" text-cyan-800 font-bold">Col</span>laboration and Increasing <span className="text-cyan-800 font-bold">pro</span>ductivity
          </p>
          
          <div className="quick-actions flex justify-center items-center grid grid-cols-2 gap-6 py-30 px-10">
            <div className="action-card flex flex-row p-8 rounded-lg shadow-lg gap-10">
            <a href="https://www.linkedin.com/in/aaryan-shetty-5a181b284/"><FaLinkedin size={30} color="oklch(0.378 0.077 168.94)" /></a>
            <a href="https://wa.me/9175026467"><FaWhatsapp size={30} color="oklch(0.378 0.077 168.94)" /></a>
            <a href="https://github.com/itsaaryanshetty"><FaGithub size={30} color="oklch(0.378 0.077 168.94)" /></a>
            <a href="https://www.instagram.com/itsaaryan_shetty/"><FaInstagram size={30} color="oklch(0.378 0.077 168.94)" /></a>
            </div>  
          </div>
          
          
          {/* <div className="linkedin py-6 flex flex-col items-center space-y-10 bg-gray-100 rounded-2xl shadow-lg p-8 mt-40">
  {/* <h2 className="text-2xl font-bold text-gray-800 ">Meet the Team</h2>
  <div className="team-members grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl"> 
     Aaryan 
     <a href='https://www.linkedin.com/in/aaryan-shetty-5a181b284/?originalSubdomain=in'>
    <div className="team-card flex items-center gap-4 bg-cyan-950 p-4 rounded-lg shadow-md hover:shadow-lg">
      <div className="icon bg-blue-100 text-blue-600 p-3 rounded-full">
        <FaLinkedinIn size={20} />
      </div>
      <div>
        <h3 className="font-bold text-md text-sky-200">Aaryan Shetty</h3>
        <p className="text-sky-200"></p>
      </div>
    </div>
    </a> 

    
  
</div> */}

        </div>
        
        <div
          className="flex-1 brightness-100 "
          style={{
            backgroundImage: `url(${Colprous})`,
            backgroundSize: '60%',
            backgroundRepeat:'no-repeat',
            backgroundPosition: 'center',
            backgroundPositionX: 'right',
            backgroundPositionY: 'top',
          }}
        ></div>
      </div>
      </div>
      </PageTransition>
    );
    };
export default About;