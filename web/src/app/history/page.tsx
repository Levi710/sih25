'use client';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Search, MapPin, Clock, Calendar, ArrowRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function HistoryPage() {
  const { trips } = useSelector((state: RootState) => state.trips);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string | 'all'>('all');

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = 
        trip.predictedMode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(trip.startTime).toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterMode === 'all' || trip.predictedMode === filterMode;
      
      return matchesSearch && matchesFilter;
    });
  }, [trips, searchQuery, filterMode]);

  const modes = ['all', 'walking', 'cycling', 'driving', 'public_transport'];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Trip History</h1>
        <p className="text-slate-500">Review your past journeys and AI classifications</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by date or mode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all",
                filterMode === mode 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTrips.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed"
            >
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300 w-8 h-8" />
              </div>
              <p className="text-slate-400 font-medium">No trips found matching your criteria.</p>
            </motion.div>
          ) : (
            filteredTrips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trip/${trip.id}`}
                className="block group"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-indigo-50 transition-colors shrink-0">
                      {trip.predictedMode === 'walking' && "🚶"}
                      {trip.predictedMode === 'cycling' && "🚲"}
                      {trip.predictedMode === 'driving' && "🚗"}
                      {trip.predictedMode === 'public_transport' && "🚌"}
                      {(!trip.predictedMode || trip.predictedMode === 'unknown') && "📍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-slate-800 text-lg capitalize">{trip.predictedMode || 'Unknown Journey'}</h3>
                        {trip.distance! > 5 && (
                          <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-100">Long Distance</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(trip.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {(trip.duration! / 60000).toFixed(0)} minutes
                        </span>
                        <span className="flex items-center gap-2 font-bold text-slate-700">
                          <MapPin className="w-4 h-4 text-indigo-500" />
                          {trip.distance?.toFixed(2)} km
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                     <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Confidence</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={cn("w-3 h-1 rounded-full", i <= 4 ? "bg-emerald-400" : "bg-slate-100")} />
                          ))}
                        </div>
                     </div>
                     <div className="bg-slate-50 group-hover:bg-indigo-600 p-2 rounded-full transition-all">
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                     </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
