'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { startTrip, stopTrip, addPoint } from '@/store/slices/tripSlice';
import { signInAnonymously } from '@/store/slices/authSlice';
import { Play, Square, MapPin, Navigation, History, User, Activity, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const dispatch = useDispatch();
  const { isTracking, currentTrip, trips } = useSelector((state: RootState) => state.trips);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [duration, setDuration] = useState(0);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && currentTrip) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - currentTrip.startTime) / 1000));
        
        // Simulate movement for demo purposes if no real GPS
        // In reality, we'd use navigator.geolocation
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, currentTrip]);

  const handleStart = () => {
    if (!isAuthenticated) {
      dispatch(signInAnonymously() as any);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy || 0,
          speed: position.coords.speed || 0,
        };
        dispatch(startTrip(point) as any);

        // Start watching
        navigator.geolocation.watchPosition((pos) => {
          dispatch(addPoint({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timestamp: pos.timestamp,
            accuracy: pos.coords.accuracy || 0,
            speed: pos.coords.speed || 0,
          }));
        });
      });
    } else {
      alert("Geolocation not supported");
    }
  };

  const handleStop = () => {
    if (showStopConfirmation) {
      dispatch(stopTrip() as any);
      setShowStopConfirmation(false);
    } else {
      setShowStopConfirmation(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-full text-slate-900 font-sans">
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tracking Card */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className={`h-2 ${isTracking ? 'bg-emerald-500' : 'bg-slate-200'} transition-all`} />
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    {isTracking ? 'Trip in Progress' : 'Ready for Departure'}
                  </h2>
                  <p className="text-slate-500">
                    {isTracking ? 'Currently capturing your travel data...' : 'Start tracking your journey to see AI insights'}
                  </p>
                </div>
                {isTracking && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-100"
                  >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    LIVE
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Duration</span>
                  <p className="text-2xl font-mono font-bold text-slate-700">{formatDuration(duration)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Points</span>
                  <p className="text-2xl font-mono font-bold text-slate-700">{currentTrip?.locations.length || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Accuracy</span>
                  <p className="text-2xl font-mono font-bold text-slate-700">
                    {currentTrip?.locations[currentTrip.locations.length-1]?.accuracy.toFixed(0) || 0}m
                  </p>
                </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
                  <p className={`text-xl font-bold ${isTracking ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isTracking ? 'Active' : 'Idle'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                {!isTracking ? (
                  <button 
                    onClick={handleStart}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                    Start Tracking Trip
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col gap-3">
                    <button 
                      onClick={handleStop}
                      className={cn(
                        "flex-1 font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2",
                        showStopConfirmation 
                          ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100" 
                          : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100"
                      )}
                    >
                      {showStopConfirmation ? (
                        <CheckCircle className="w-5 h-5 fill-current" />
                      ) : (
                        <Square className="w-5 h-5 fill-current" />
                      )}
                      {showStopConfirmation ? 'Confirm Stop' : 'Stop & Finish'}
                    </button>
                    {showStopConfirmation && (
                      <button 
                        onClick={() => setShowStopConfirmation(false)}
                        className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Activity Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                Recent Journeys
              </h3>
              <button className="text-sm font-medium text-indigo-600 hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {trips.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 border-dashed">
                    <p className="text-slate-400">No trips recorded yet.</p>
                  </div>
                ) : (
                  trips.map((trip) => (
                    <Link 
                      key={trip.id}
                      href={`/trip/${trip.id}`}
                      className="block group"
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer"
                      >
                        <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-indigo-50 transition-colors">
                          {trip.predictedMode === 'walking' && <span className="text-2xl">🚶</span>}
                          {trip.predictedMode === 'cycling' && <span className="text-2xl">🚲</span>}
                          {trip.predictedMode === 'driving' && <span className="text-2xl">🚗</span>}
                          {trip.predictedMode === 'public_transport' && <span className="text-2xl">🚌</span>}
                          {(!trip.predictedMode || trip.predictedMode === 'unknown') && <span className="text-2xl">📍</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 capitalize">
                              {trip.predictedMode || 'Unknown Trip'}
                            </h4>
                            <span className="text-xs font-bold text-slate-400">
                              {new Date(trip.startTime).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {(trip.duration! / 60000).toFixed(0)} mins</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {trip.distance?.toFixed(2)} km</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Impact Dashboard
            </h3>
            
            <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-500">Weekly Target</span>
                  <span className="font-bold text-slate-700">65%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[65%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-400 uppercase block mb-1">Total Km</span>
                  <p className="text-2xl font-bold text-indigo-700">{trips.reduce((acc, t) => acc + (t.distance || 0), 0).toFixed(1)}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-400 uppercase block mb-1">Eco Trips</span>
                  <p className="text-2xl font-bold text-emerald-700">
                    {trips.filter(t => t.predictedMode === 'walking' || t.predictedMode === 'cycling').length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10 transition-transform group-hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-2">Smart Insights</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Our AI model has high confidence in your walking patterns. Keep it up for better health!
              </p>
              <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm tracking-tight hover:bg-slate-100 transition-colors">
                View Reports
              </button>
            </div>
            <Activity className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-white opacity-[0.05] group-hover:scale-110 transition-transform" />
          </section>
        </div>
      </main>
    </div>
  );
}
