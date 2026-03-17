'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setTrackingEnabled, setPushNotifications } from '@/store/slices/userSlice';
import { signOut } from '@/store/slices/authSlice';
import { syncTripsThunk } from '@/store/slices/tripSlice';
import { 
  User, Settings, Shield, Bell, Database, 
  LogOut, ChevronRight, BarChart3, Download, Trash2, Github, Cloud, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const settings = useSelector((state: RootState) => state.user);
  const { trips, loading: isSyncing } = useSelector((state: RootState) => state.trips);
  
  const [isExporting, setIsExporting] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const stats = [
    { label: 'Total Distance', value: `${trips.reduce((acc, t) => acc + (t.distance || 0), 0).toFixed(2)} km`, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Trips', value: trips.length, icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Synced', value: trips.filter(t => t.synced).length, icon: Cloud, color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  const handleSync = async () => {
    await dispatch(syncTripsThunk());
    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 3000);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const data = { trips, settings, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `traveltrack-export-${Date.now()}.json`;
      a.click();
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <button 
            onClick={handleSync}
            disabled={isSyncing}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              showSyncSuccess ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
              isSyncing ? "bg-slate-100 text-slate-400 border border-slate-200" :
              "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
            )}
           >
             {showSyncSuccess ? <CheckCircle className="w-4 h-4" /> : <Cloud className={cn("w-4 h-4", isSyncing && "animate-bounce")} />}
             {showSyncSuccess ? 'Synced' : isSyncing ? 'Syncing...' : 'Sync Cloud'}
           </button>
        </div>
        
        <div className="relative group">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold p-1 shadow-lg shadow-indigo-200">
             {user?.name?.[0] || 'G'}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
            <Settings className="w-4 h-4" />
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">{user?.name || 'Guest User'}</h1>
          <p className="text-slate-500 font-medium mb-4">{user?.isAnonymous ? 'Anonymous Member' : 'Premium Member'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">SIH 2025</span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">Eco-warrior</span>
          </div>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={() => dispatch(signOut())}
            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
           >
            <LogOut className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
             <h2 className="font-bold text-lg text-slate-800">Preferences</h2>
          </div>
          <div className="divide-y divide-slate-50">
             <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-2.5 rounded-xl">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Trip Tracking</h3>
                    <p className="text-xs text-slate-500">Enable high-precision location captures</p>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch(setTrackingEnabled(!settings.trackingEnabled))}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.trackingEnabled ? "bg-indigo-600" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.trackingEnabled ? "left-7" : "left-1"
                  )} />
                </button>
             </div>

             <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 p-2.5 rounded-xl">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <p className="text-xs text-slate-500">Get nudges for unconfirmed journeys</p>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch(setPushNotifications(!settings.pushNotifications))}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    settings.pushNotifications ? "bg-indigo-600" : "bg-slate-200"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    settings.pushNotifications ? "left-7" : "left-1"
                  )} />
                </button>
             </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
             <h2 className="font-bold text-lg text-slate-800">Data & Privacy</h2>
          </div>
          <div className="divide-y divide-slate-50">
             <button 
               onClick={handleExport}
               disabled={isExporting}
               className="w-full flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition-colors text-left"
             >
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-50 p-2.5 rounded-xl">
                    <Download className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Export Data</h3>
                    <p className="text-xs text-slate-500">{isExporting ? 'Preparing file...' : 'Download all your record in JSON'}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
             </button>

             <button className="w-full flex items-center justify-between px-8 py-5 hover:bg-rose-50 transition-colors group text-left">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-50 p-2.5 rounded-xl">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-rose-700 transition-colors">Wipe All Data</h3>
                    <p className="text-xs text-slate-500"> Irreversible removal of your history</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-rose-300 transition-colors" />
             </button>
          </div>
        </section>
      </div>

      <div className="text-center pt-10">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Developed for SIH 2025</p>
        <div className="flex justify-center gap-6">
           <Github className="w-5 h-5 text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
}
