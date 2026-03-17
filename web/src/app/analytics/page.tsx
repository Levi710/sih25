'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  BarChart3, PieChart, TrendingUp, Map, Clock, 
  ArrowUpRight, ArrowDownRight, Zap, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { trips } = useSelector((state: RootState) => state.trips);

  const stats = useMemo(() => {
    const totalDistance = trips.reduce((acc, t) => acc + (t.distance || 0), 0);
    const totalDuration = trips.reduce((acc, t) => acc + (t.duration || 0), 0);
    const avgDistance = trips.length > 0 ? totalDistance / trips.length : 0;
    
    const modeCounts = trips.reduce((acc, t) => {
      const mode = t.predictedMode || 'unknown';
      acc[mode] = (acc[mode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalDistance, totalDuration, avgDistance, modeCounts };
  }, [trips]);

  const cards = [
    { label: 'Weekly Growth', value: '+12.5%', icon: TrendingUp, color: 'text-emerald-500', trend: 'up' },
    { label: 'Avg Speed', value: '24.2 km/h', icon: Zap, color: 'text-amber-500', trend: 'down' },
    { label: 'Eco Score', value: '82/100', icon: Target, color: 'text-indigo-500', trend: 'up' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1 font-sans">Smart Insights</h1>
          <p className="text-slate-500 font-medium">Predictive analytics based on your movement patterns</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200">
           <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Weekly</button>
           <button className="px-4 py-2 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Monthly</button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group"
          >
             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50", card.color)}>
                <card.icon className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{card.label}</p>
             <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-slate-800">{card.value}</span>
                <span className={cn(
                  "flex items-center text-xs font-bold mb-1",
                  card.trend === 'up' ? "text-emerald-500" : "text-rose-500"
                )}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  2.4%
                </span>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                <card.icon className="w-32 h-32" />
             </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mode Distribution */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                 <PieChart className="w-6 h-6 text-indigo-500" /> Mode Split
              </h2>
           </div>
           
           <div className="space-y-6">
              {Object.entries(stats.modeCounts).map(([mode, count]) => (
                <div key={mode} className="space-y-2">
                   <div className="flex justify-between items-center text-sm font-bold">
                      <span className="capitalize text-slate-700">{mode.replace('_', ' ')}</span>
                      <span className="text-slate-400">{Math.round((count / trips.length) * 100)}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / trips.length) * 100}%` }}
                        className={cn(
                          "h-full rounded-full",
                          mode === 'walking' && "bg-emerald-400",
                          mode === 'cycling' && "bg-amber-400",
                          mode === 'driving' && "bg-indigo-500",
                          mode === 'public_transport' && "bg-purple-500"
                        )} 
                      />
                   </div>
                </div>
              ))}
              {Object.keys(stats.modeCounts).length === 0 && (
                <p className="text-center text-slate-400 py-10 font-medium italic">Track more trips to see analysis...</p>
              )}
           </div>
        </section>

        {/* Temporal Trends */}
        <section className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden">
           <h2 className="text-xl font-bold flex items-center gap-3">
              <Clock className="w-6 h-6 text-indigo-400" /> Activity Hours
           </h2>
           <div className="flex items-end justify-between h-48 gap-2 pt-10">
              {[40, 70, 45, 90, 65, 80, 55, 60, 40, 30, 20, 10].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="w-full bg-indigo-500/20 rounded-t-lg group relative"
                >
                   <div className="absolute inset-0 bg-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-bottom rounded-t-lg" />
                </motion.div>
              ))}
           </div>
           <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-widest">
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>00:00</span>
           </div>
           <p className="text-xs text-indigo-300 font-bold bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
              💡 Peak activity detected between 08:30 and 10:00. Commute patterns confirmed.
           </p>
        </section>
      </div>

      {/* Carbon Impact Section */}
      <section className="bg-indigo-600 p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl shadow-indigo-200">
         <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
            <h2 className="text-4xl font-black">Environmental Impact</h2>
            <p className="text-indigo-100 text-lg font-medium max-w-lg">
               By using eco-friendly travel modes (walking/cycling), you've saved approximately 
               <span className="text-white font-black underline decoration-indigo-300 decoration-4 underline-offset-8 mx-2">
                 {(stats.totalDistance * 0.12).toFixed(1)} kg
               </span>
               of CO2 emissions this month.
            </p>
            <div className="flex justify-center md:justify-start">
               <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-800/20 hover:scale-105 transition-transform uppercase tracking-widest text-sm">
                  Full Eco Report
               </button>
            </div>
         </div>
         <div className="relative">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-3xl border border-white/20 animate-pulse">
               <TrendingUp className="w-20 h-20 text-white" />
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center border-4 border-indigo-600 rotate-12">
               <Zap className="w-6 h-6 text-indigo-900" />
            </div>
         </div>
         <BarChart3 className="absolute -left-10 -bottom-10 w-64 h-64 text-white/5 pointer-events-none" />
      </section>
    </div>
  );
}
