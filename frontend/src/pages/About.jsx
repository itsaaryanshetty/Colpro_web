import React from "react";
import Colprous from '../assets/Colprous.jpeg';
import PageTransition from "../components/PageTransition";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";
// Note: Lucide doesn't have Whatsapp, sticking to Lucide for consistency or could use react-icons if preferred. 
// Given the previous file used react-icons for all, I'll switch to Lucide for a modern feel where possible, 
// but for brand icons like Whatsapp that might be missing, I'll use a generic MessageCircle or stick to react-icons if I import them.
// Let's stick to react-icons for the brands to match the specific requests (Whatsapp/Linkedin/Instagram/Github).
// Actually, to keep the "new premium theme" consistent with other pages (which use Lucide), I should try to use Lucide where possible.
// But Lucide doesn't have brand icons usually. 
// I will import react-icons for the brands as they are specific.
import { FaLinkedin, FaWhatsapp, FaGithub, FaInstagram } from "react-icons/fa";

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950 text-slate-50 pt-24 pb-12 relative overflow-hidden font-sans selection:bg-emerald-500/30">

        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Text Content */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700 fade-in order-2 lg:order-1">
              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                  About <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Colpro</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                  Welcome to the future of project management.
                  <span className="text-emerald-400 font-semibold block mt-4 text-2xl">
                    Collaboration + Productivity = Colpro
                  </span>
                </p>
                <p className="mt-6 text-slate-400 leading-relaxed">
                  Colpro is designed to streamline your workflow, bringing teams together to achieve more in less time.
                  Whether you're tracking tasks, analyzing performance, or scaling your dream project, we've got you covered.
                </p>
              </div>

              {/* Developer / Contact Section */}
              <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                  Connect with the Developer
                </h3>

                <div className="flex flex-wrap gap-4">
                  <SocialButton
                    href="https://www.linkedin.com/in/aaryan-shetty-5a181b284/"
                    icon={<FaLinkedin size={24} />}
                    label="LinkedIn"
                    color="hover:bg-[#0077b5]"
                  />
                  <SocialButton
                    href="https://github.com/itsaaryanshetty"
                    icon={<FaGithub size={24} />}
                    label="GitHub"
                    color="hover:bg-[#333]"
                  />
                  <SocialButton
                    href="https://wa.me/9175026467"
                    icon={<FaWhatsapp size={24} />}
                    label="WhatsApp"
                    color="hover:bg-[#25D366]"
                  />
                  <SocialButton
                    href="https://www.instagram.com/itsaaryan_shetty/"
                    icon={<FaInstagram size={24} />}
                    label="Instagram"
                    color="hover:bg-[#E1306C]"
                  />
                </div>
              </div>
            </div>

            {/* Hero Image / Graphic */}
            <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end animate-in slide-in-from-right duration-700 fade-in">
              <div className="relative w-full max-w-md aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-800/50 group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-60"></div>
                <img
                  src={Colprous}
                  alt="Colpro Team"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
                  <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">Developer</p>
                  <p className="text-white font-bold text-xl">Aaryan Shetty</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl animate-pulse delay-700"></div>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const SocialButton = ({ href, icon, label, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800 text-slate-300 transition-all duration-300 hover:text-white ${color} hover:shadow-lg hover:-translate-y-1 group`}
  >
    <span className="transition-transform group-hover:scale-110">{icon}</span>
    <span className="font-medium">{label}</span>
  </a>
);

export default About;