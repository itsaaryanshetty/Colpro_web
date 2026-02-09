import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Home = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">

        {/* Navbar is rendered by App.jsx, but we need to account for its height in spacing if it's fixed */}

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">

          {/* Background Effects */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[100px] animate-blob"></div>
            <div className="absolute top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px] animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-slate-900/50 border border-slate-800 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm shadow-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Colpro &mdash; Collaboration Redefined
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
                Manage projects with <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-sm">
                  unmatched clarity.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Streamline your workflow, unite your team, and achieve your goals.
                Colpro brings everything you need into one intuitive, dark-themed workspace.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <Link to="/register" className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-950 transition-all duration-200 bg-emerald-400 rounded-full hover:bg-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-emerald-400">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-slate-800/50 border border-slate-700/50 rounded-full hover:bg-slate-800 hover:border-emerald-500/50 hover:shadow-lg hover:-translate-y-1 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-slate-700">
                  Login
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-900/50 border-t border-slate-800/50 relative">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything you need to succeed</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Powerful features designed to keep your team aligned and efficient, wrapped in a beautiful interface.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="w-8 h-8 text-emerald-400" />}
                title="Seamless Collaboration"
                description="Connect with your team in real-time. Share updates, assign tasks, and keep everyone in the loop without the chaos."
                delay={0.2}
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-emerald-400" />}
                title="Boost Productivity"
                description="Automate routine tasks and focus on what matters. Our tools are designed to remove friction from your daily workflow."
                delay={0.4}
              />
              <FeatureCard
                icon={<CheckCircle className="w-8 h-8 text-emerald-400" />}
                title="Track Progress"
                description="Visual timelines and detailed reports give you a 360-degree view of your project's health and completion status."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* CTA / Bottom Section */}
        <section className="py-32 relative overflow-hidden">

          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">Ready to transform your workflow?</h2>
              <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
                Join thousands of teams who rely on Colpro to ship faster and better.
              </p>
              <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-slate-950 transition-all duration-200 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full hover:shadow-[0_0_40px_rgba(52,211,153,0.6)] hover:scale-105">
                Start Your Journey
              </Link>
            </motion.div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl bg-slate-800/20 border border-slate-700/50 hover:bg-slate-800/40 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 group backdrop-blur-sm"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-300 shadow-lg shadow-black/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export default Home;