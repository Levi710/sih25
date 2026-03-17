'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { deleteTrip } from '@/store/slices/tripSlice';
import { 
  ArrowLeft, MapPin, Clock, Calendar, BarChart, 
  Trash2, ShieldCheck, Flag, MousePointer2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function TripDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { trips } = useSelector((state: RootState) => state.trips);

  const trip = useMemo(() => trips.find(t => t.id === id), [trips, id]);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-slate-500 font-medium text-lg">Trip not found.</p>
        <button 
          onClick={() => router.push('/history')}
          className="text-indigo-600 font-bold hover:underline"
        >
          Return to History
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this trip?")) {
      dispatch(deleteTrip(trip.id));
      router.push('/history');
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 hover:shadow-sm transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Trip ID</p>
          <p className="text-xs font-mono font-bold text-slate-500">{trip.id}</p>
        </div>
      </div>

      {/* Main Info */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 uppercase tracking-widest">
                AI Classified
              </span>
            </div>
            <h1 className="text-5xl font-black capitalize mb-2">{trip.predictedMode || 'Unknown'}</h1>
            <p className="opacity-70 font-medium">Recorded on {new Date(trip.startTime).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            className="absolute -right-10 -bottom-10 text-[12rem] font-black"
          >
             {trip.predictedMode === 'walking' && "🚶"}
             {trip.predictedMode === 'cycling' && "🚲"}
             {trip.predictedMode === 'driving' && "🚗"}
             {trip.predictedMode === 'public_transport' && "🚌"}
          </motion.div>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> Duration
              </span>
              <p className="text-2xl font-black text-slate-800">{(trip.duration! / 60000).toFixed(0)} min</p>
              <p className="text-xs text-slate-400 font-medium">Total journey time</p>
           </div>
           <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <BarChart className="w-3 h-3" /> Distance
              </span>
              <p className="text-2xl font-black text-slate-800">{trip.distance?.toFixed(2)} km</p>
              <p className="text-xs text-slate-400 font-medium">Trajectory length</p>
           </div>
           <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <MousePointer2 className="w-3 h-3" /> Data Points
              </span>
              <p className="text-2xl font-black text-slate-800">{trip.locations.length}</p>
              <p className="text-xs text-slate-400 font-medium">Captured GPS fixes</p>
           </div>
        </div>
      </section>

      {/* Path Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
           <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Flag className="w-5 h-5 text-indigo-500" /> Start Point
           </h2>
           <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Time</span>
                <span className="font-bold text-slate-700">{new Date(trip.startTime).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Latitude</span>
                <span className="font-mono text-slate-700">
                  {trip.locations.length > 0 ? trip.locations[0].latitude.toFixed(6) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Longitude</span>
                <span className="font-mono text-slate-700">
                  {trip.locations.length > 0 ? trip.locations[0].longitude.toFixed(6) : 'N/A'}
                </span>
              </div>
           </div>
        </section>

        <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
           <h2 className="font-bold text-slate-800 flex items-center gap-2 text-rose-500">
              <MapPin className="w-5 h-5" /> End Point
           </h2>
           <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Time</span>
                <span className="font-bold text-slate-700">{trip.endTime ? new Date(trip.endTime).toLocaleTimeString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Latitude</span>
                <span className="font-mono text-slate-700">
                  {trip.locations.length > 0 ? trip.locations[trip.locations.length - 1].latitude.toFixed(6) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Longitude</span>
                <span className="font-mono text-slate-700">
                  {trip.locations.length > 0 ? trip.locations[trip.locations.length - 1].longitude.toFixed(6) : 'N/A'}
                </span>
              </div>
           </div>
        </section>
      </div>

      {/* Admin Actions */}
      <div className="pt-8 flex flex-col items-center gap-4">
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 text-rose-500 font-bold hover:text-rose-600 px-6 py-3 rounded-2xl hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
        >
          <Trash2 className="w-5 h-5" />
          Delete This Entry
        </button>
        <p className="text-[10px] text-slate-400 font-medium">Deleted entries cannot be recovered from local storage.</p>
      </div>
    </div>
  );
}
