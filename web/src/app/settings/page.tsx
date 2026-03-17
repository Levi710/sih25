'use client';

import { Settings, Shield, Bell, Map, Database, Layout, Palette, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const sections = [
    { 
      title: 'App Experience', 
      items: [
        { label: 'Dark Mode', desc: 'System preference', icon: Palette },
        { label: 'Compact View', desc: 'Show more trips on screen', icon: Layout },
      ]
    },
    { 
      title: 'Tracking Precision', 
      items: [
        { label: 'Battery Optimization', desc: 'Reduce GPS frequency when battery is low', icon: Heart },
        { label: 'Auto-Start', desc: 'Start tracking when high motion detected', icon: Map },
      ]
    },
    { 
      title: 'Storage', 
      items: [
        { label: 'Auto-Cleanup', desc: 'Remove trips older than 30 days', icon: Database },
        { label: 'Cloud Buffer', desc: 'Keep local copy after sync', icon: Shield },
      ]
    }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
        <p className="text-slate-500 font-medium">Customize your TravelTrack experience</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <motion.section 
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">{section.title}</h2>
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
               {section.items.map((item, i) => (
                 <div key={item.label} className={cn(
                   "flex items-center justify-between p-6 hover:bg-slate-50 transition-colors cursor-pointer",
                   i !== section.items.length - 1 && "border-b border-slate-100"
                 )}>
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-3 rounded-2xl text-slate-600">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.label}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300">
                       <Layout className="w-4 h-4" />
                    </div>
                 </div>
               ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
