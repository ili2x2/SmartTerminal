
import React from 'react';
import { GateEntry } from '../types';
import { Truck, Video, Mic, ShieldCheck, XCircle, Clock } from 'lucide-react';

interface Props {
  gates: GateEntry[];
}

const GateView: React.FC<Props> = ({ gates }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      
      {/* Live Feed Mockup */}
      <div className="lg:col-span-2 space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Интеллектуальный КПП</h2>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-xs text-red-500 dark:text-red-400 font-mono">LIVE FEED REC</span>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 h-96">
            {['GATE-1 (Въезд)', 'GATE-2 (Въезд)', 'GATE-3 (Выезд)', 'GATE-4 (Выезд)'].map((cam, idx) => (
              <div key={idx} className="relative bg-black rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 group shadow-sm">
                 {/* Mock Camera UI */}
                 <div className="absolute top-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white font-mono backdrop-blur-sm z-10">
                   CAM-{idx+1} • {cam}
                 </div>
                 <div className="absolute bottom-2 right-2 text-zinc-500">
                   <Video size={16} />
                 </div>
                 {/* Simulated Camera Content - Gray generic background with overlay lines */}
                 <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center relative">
                    <Truck size={48} className="text-zinc-300 dark:text-zinc-800 group-hover:text-zinc-400 dark:group-hover:text-zinc-700 transition-colors" />
                    <div className="absolute inset-0 border-2 border-zinc-300/50 dark:border-zinc-800/50 m-4 rounded pointer-events-none">
                       <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500"></div>
                       <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500"></div>
                       <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500"></div>
                       <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500"></div>
                    </div>
                 </div>
              </div>
            ))}
         </div>

         <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
           <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Журнал доступа (24ч)</h3>
           <table className="w-full text-left text-sm">
             <thead>
               <tr className="text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                 <th className="pb-3 font-medium">Время</th>
                 <th className="pb-3 font-medium">Гос. Номер</th>
                 <th className="pb-3 font-medium">Водитель</th>
                 <th className="pb-3 font-medium">Компания</th>
                 <th className="pb-3 font-medium">КПП</th>
                 <th className="pb-3 font-medium">Статус</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
               {gates.map(gate => (
                 <tr key={gate.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                   <td className="py-3 font-mono text-zinc-500 dark:text-zinc-400">{gate.timestamp}</td>
                   <td className="py-3 font-bold text-zinc-800 dark:text-zinc-200">{gate.truckPlate}</td>
                   <td className="py-3 text-zinc-600 dark:text-zinc-300">{gate.driverName}</td>
                   <td className="py-3 text-zinc-500 dark:text-zinc-400">{gate.company}</td>
                   <td className="py-3 text-zinc-500 dark:text-zinc-400">{gate.gateId}</td>
                   <td className="py-3">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${
                       gate.status === 'GRANTED' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                       gate.status === 'DENIED' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                       'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                     }`}>
                       {gate.status === 'GRANTED' && <ShieldCheck size={12} />}
                       {gate.status === 'DENIED' && <XCircle size={12} />}
                       {gate.status === 'PROCESSING' && <Clock size={12} />}
                       {gate.status}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Ручное управление</h3>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-lg">
               <div className="flex justify-between items-start mb-2">
                 <span className="text-amber-600 dark:text-amber-400 text-sm font-bold">ОЖИДАЕТ РЕШЕНИЯ</span>
                 <span className="text-zinc-500 text-xs">GATE-2</span>
               </div>
               <div className="text-center py-4">
                 <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">B 889 BC 02</p>
                 <p className="text-sm text-zinc-500 dark:text-zinc-400">SilkRoad Logistics</p>
               </div>
               <div className="grid grid-cols-2 gap-2 mt-2">
                 <button className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium transition-colors">
                   Открыть
                 </button>
                 <button className="py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-red-600 hover:text-white text-zinc-700 dark:text-zinc-300 rounded text-sm font-medium transition-colors">
                   Отказать
                 </button>
               </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <span className="text-sm text-zinc-600 dark:text-zinc-300">Голосовая связь (КПП-2)</span>
              <button className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-blue-600 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-white transition-colors">
                <Mic size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
           <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Статистика за смену</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Всего проездов</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-white">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Среднее время обр.</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-white">4.2 мин</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Отказов</span>
                <span className="text-lg font-bold text-red-500 dark:text-red-400">3</span>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default GateView;
