'use client';

import { Info, Shield, Github, Mail, ExternalLink, Navigation, Database, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InfoPage() {
  const features = [
    { title: 'Real-time Tracking', desc: 'Continuous location monitoring using browser-based Geolocation API with high-accuracy filters.', icon: Navigation },
    { title: 'AI Classification', desc: 'Predicts travel modes (Walking, Cycling, Driving, etc.) using velocity and movement pattern analysis.', icon: Cpu },
    { title: 'Offline-First', desc: 'All trip data is stored locally in your browser using Redux Thunk and LocalStorage.', icon: Database },
    { title: 'Privacy Focused', desc: 'Advanced anonymization of GPS data. No personal identities are linked to your movement patterns.', icon: Shield },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-200">
           <Info className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-800">TravelTrack AI</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          A state-of-the-art travel data collection platform built for Smart India Hackathon 2025. 
          Bridging the gap between manual surveys and automated urban planning.
        </p>
      </section>

      {/* Tech Stack */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <motion.div 
            key={f.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm"
          >
            <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 font-bold">
               <f.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Information Modules */}
      <div className="space-y-6">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Mission & Purpose</h2>
          <p className="text-slate-600 leading-relaxed font-medium">
            This application was designed to solve the challenge of manual data collection in urban planning. 
            By leveraging mobile sensors and AI, we provide city planners with accurate, structured, and 
            anonymous data about how people move within the city.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <button className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                <Github className="w-5 h-5" /> View Project Source
             </button>
             <button className="flex items-center gap-2 text-slate-400 font-bold hover:bg-slate-50 px-4 py-2 rounded-xl transition-all">
                <Mail className="w-5 h-5" /> Contact Support
             </button>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
           <div className="relative z-10 space-y-4">
              <h2 className="text-xl font-bold">SIH 2025 Submission</h2>
              <p className="text-white/60 font-medium">
                Team Identifier: SIH25-LEV-710<br/>
                Problem Statement ID: DR-XXX<br/>
                Status: Final Build (Web Migration)
              </p>
           </div>
           <Info className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5" />
        </div>
      </div>

      <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
         Version 2.4.0 (Alpha) • Licensed under MIT
      </p>
    </div>
  );
}
