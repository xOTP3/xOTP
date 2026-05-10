/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Users, 
  Share2, 
  Activity, 
  ShieldCheck, 
  Server, 
  Wifi, 
  Terminal,
  Cpu
} from 'lucide-react';

interface Stats {
  status: string;
  bot: string;
  users: number;
  referrals: number;
}

export default function App() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Failed to fetch stats");
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-white/10 pb-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Bot size={28} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white uppercase italic">
                God Mode V5 <span className="text-emerald-500 not-italic ml-1">● ONLINE</span>
              </h1>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono">
                Railway Deployment Node: AIS-PROD-AUTO
              </p>
            </div>
          </div>
          
          <div className="flex gap-8 items-center text-right">
            <div className="hidden sm:block">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Server Memory</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono text-emerald-400">Low Latency</p>
                <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Active Connection</p>
              <p className="text-sm font-mono flex items-center justify-end gap-2 text-white">
                <Wifi size={14} className="text-emerald-500" /> Secure SSL
              </p>
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 auto-rows-[minmax(120px,auto)]">
          {/* Main Registry Block (Simulated Content) */}
          <section className="md:col-span-8 md:row-span-4 bg-[#141416] border border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-white/70">
                <Terminal size={18} className="text-emerald-500" />
                <h2 className="text-sm font-semibold uppercase tracking-widest">Target Registry Overview</h2>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-1 bg-white/5 rounded-lg border border-white/10 uppercase font-mono">Real-time Sync</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left text-sm font-mono">
                <thead>
                  <tr className="text-white/20 border-b border-white/5 text-[11px] font-normal uppercase tracking-wider">
                    <th className="pb-3 pr-4">Metrics</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <RegistryRow label="Total Registered Users" value={stats?.users || 0} icon={<Users size={14} />} />
                  <RegistryRow label="Active Referral Chains" value={stats?.referrals || 0} icon={<Share2 size={14} />} />
                  <RegistryRow label="Bot Instance Health" value={stats?.bot === 'running' ? 'Active' : 'Offline'} icon={<Activity size={14} />} />
                  <RegistryRow label="API Response Time" value="42ms" icon={<Cpu size={14} />} />
                  <RegistryRow label="Database Sync" value="99.9%" icon={<Server size={14} />} />
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex gap-4">
              <button className="flex-1 py-3 bg-white text-black font-bold rounded-2xl text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_4px_15px_rgba(255,255,255,0.1)]">
                Launch Bot
              </button>
              <button className="px-6 py-3 border border-white/10 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                Export Logs
              </button>
            </div>
          </section>

          {/* Stats Column */}
          <div className="md:col-span-4 md:row-span-2 bg-[#1A1A1D] border border-white/5 rounded-3xl p-6 flex flex-col justify-center gap-2 group hover:border-emerald-500/20 transition-all">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1 group-hover:text-emerald-500/50 transition-colors">User Ecosystem</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-bold text-white tracking-tighter">{stats?.users || 0}</p>
              <span className="text-sm font-mono text-emerald-500">+{(stats?.users || 0) > 0 ? 1 : 0} Live</span>
            </div>
            <div className="mt-4 flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1A1D] bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden flex items-center justify-center text-[10px] font-bold text-white/30">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 md:row-span-2 bg-[#1A1A1D] border border-white/5 rounded-3xl p-6 flex flex-col justify-center gap-2 group hover:border-blue-500/20 transition-all">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1 group-hover:text-blue-500/50 transition-colors">Firebase Health</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-bold text-white tracking-tighter">99.9%</p>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded capitalize">Stable</span>
            </div>
            <div className="mt-4 grid grid-cols-10 gap-1 h-3">
              {[...Array(10)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-sm ${i === 9 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Large Vertical Sniffer Block (Right Sidebar) */}
          <section className="md:col-span-4 md:row-span-4 bg-[#0F0F11] border border-white/5 rounded-3xl p-6 flex flex-col overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,44,44,0.5)]" />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Live Sniffer Activity</h2>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <SniffItem 
                type="DETECTED"
                source="CP-AMAZON"
                msg="Your OTP for login is 49201. Do not share..."
                time="12:44:01 PM"
                color="text-emerald-400"
              />
              <SniffItem 
                type="FETCHED"
                source="BANK-AUTH"
                msg="Payment of Rs. 12,499 processed..."
                time="12:41:15 PM"
                color="text-blue-400"
              />
              <SniffItem 
                type="SYNC"
                source="FIREBASE"
                msg="Target heartbeat validated successfully."
                time="12:39:55 PM"
                color="text-white/40"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Filter activity..." 
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                />
                <div className="absolute right-3 top-3.5 opacity-20 group-focus-within:opacity-50 transition-opacity">
                  <Terminal size={14} />
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Security Info */}
          <div className="md:col-span-8 md:row-span-2 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-8 flex items-center justify-between gap-8 group">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-3 text-white">
                <ShieldCheck className="text-emerald-400" /> Infrastructure Locked
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Railway instance migrated. Memory issues resolved via high-priority queueing and cold-boot optimizations. All keys encrypted.
              </p>
            </div>
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] text-white/20 font-mono mb-1">REGION: ASIA-SOUTH1</span>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-4 h-1 bg-emerald-500 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase tracking-[0.4em] font-mono gap-4 py-8">
          <p>© 2026 RAILWAY_REMIGRATION_X_TEAM // ENCRYPTED CONTROL</p>
          <div className="flex gap-6">
            <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> SSL SECURE</p>
            <p>INSTANCE: 8821-X99-PROD</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function RegistryRow({ label, value, icon }: { label: string, value: string | number, icon: JSX.Element }) {
  return (
    <tr className="group hover:bg-white/[0.02] transition-colors border-l-2 border-transparent hover:border-emerald-500">
      <td className="py-4 text-white/60 font-medium">
        <div className="flex items-center gap-3">
          <span className="opacity-40">{icon}</span>
          {label}
        </div>
      </td>
      <td className="py-4">
        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold border border-emerald-500/20">LIVE</span>
      </td>
      <td className="py-4 text-white font-bold">{value}</td>
    </tr>
  );
}

function SniffItem({ type, source, msg, time, color }: { type: string, source: string, msg: string, time: string, color: string }) {
  return (
    <motion.div 
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-all cursor-default"
    >
      <div className="flex justify-between items-start mb-2">
        <p className={`text-[10px] font-bold tracking-widest ${color}`}>{type}</p>
        <span className="text-[9px] opacity-30 font-mono tracking-tighter">{time}</span>
      </div>
      <p className="text-[11px] text-white/50 mb-1">SOURCE: <span className="text-white">{source}</span></p>
      <p className="text-[12px] text-white/90 italic font-medium tracking-tight">"{msg}"</p>
    </motion.div>
  );
}
