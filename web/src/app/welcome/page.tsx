'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { completeWelcome } from '@/store/slices/userSlice';
import { Shield, Map, Info, CheckCircle2, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function WelcomePage() {
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleStart = () => {
    if (consent1 && consent2) {
      dispatch(completeWelcome());
      localStorage.setItem('hasCompletedWelcome', 'true');
      router.push('/');
    }
  };

  const benefits = [
    { title: 'Smart Detection', desc: 'AI-powered travel mode classification.', icon: Navigation },
    { title: 'Personal Insights', desc: 'Detailed history of your movements.', icon: Map },
    { title: 'Research Contribution', desc: 'Help improve urban logistics.', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-slate-100 overflow-hidden"
      >
        <div className="bg-indigo-600 p-12 text-white text-center sm:text-left relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-4">TravelTrack AI</h1>
            <p className="opacity-80 font-medium text-lg leading-relaxed">
              Join thousands of users in mapping the future of sustainable transportation through smart data collection.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
             <Navigation className="w-64 h-64 rotate-12 translate-x-12 translate-y-12" />
          </div>
        </div>

        <div className="p-12 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title}>
                 <b.icon className="w-6 h-6 text-indigo-500 mb-3" />
                 <h3 className="font-bold text-slate-800 text-sm mb-1">{b.title}</h3>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-50">
             <button 
              onClick={() => setConsent1(!consent1)}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all",
                consent1 ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-100 hover:border-slate-200"
              )}
             >
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                  consent1 ? "bg-indigo-600 text-white" : "bg-slate-50 border border-slate-200"
                )}>
                  {consent1 && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">Research Consent</h4>
                  <p className="text-xs text-slate-500 font-medium">I consent to sharing my travel data for anonymous transportation research.</p>
                </div>
             </button>

             <button 
              onClick={() => setConsent2(!consent2)}
              className={cn(
                "w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all",
                consent2 ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-100 hover:border-slate-200"
              )}
             >
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
                  consent2 ? "bg-indigo-600 text-white" : "bg-slate-50 border border-slate-200"
                )}>
                  {consent2 && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">Security & Privacy</h4>
                  <p className="text-xs text-slate-500 font-medium">I understand that all data is anonymized and stored securely using industry standards.</p>
                </div>
             </button>
          </div>

          <button 
            onClick={handleStart}
            disabled={!consent1 || !consent2}
            className={cn(
              "w-full py-5 rounded-[1.5rem] font-bold text-lg shadow-lg transition-all",
              consent1 && consent2 
                ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            )}
          >
            Get Started
          </button>
        </div>
      </motion.div>
    </div>
  );
}
