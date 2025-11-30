import React from 'react';
import { ZoneData, Container, ContainerType } from '../types';
import { Container as ContainerIcon } from 'lucide-react';

interface Props {
  zones: ZoneData[];
  containers: Container[];
}

const YardMap: React.FC<Props> = ({ zones, containers }) => {
  // Helper to get color based on occupancy percentage
  const getZoneColor = (occupancy: number, capacity: number, type: string) => {
    const percentage = occupancy / capacity;
    if (type === 'HAZMAT') return 'border-amber-500/50 bg-amber-500/10 dark:bg-amber-500/10';
    if (percentage > 0.9) return 'border-red-500/50 bg-red-500/10 dark:bg-red-500/10';
    if (percentage > 0.7) return 'border-orange-500/50 bg-orange-500/10 dark:bg-orange-500/10';
    return 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5';
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in duration-300">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Цифровой двойник: Склад</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Визуализация штабелей и зон в реальном времени</p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 bg-blue-500 rounded-sm"></span>СУХОГРУЗ</div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>РЕФ</div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span>ОПАСНЫЙ</div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-8 relative overflow-hidden shadow-sm transition-colors duration-300">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10" 
             style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Map Layout */}
        <div className="relative z-10 grid grid-cols-2 gap-8 h-full">
          
          {/* Top Row Zones */}
          {zones.slice(0, 2).map(zone => (
            <ZoneBlock key={zone.id} zone={zone} containers={containers} colorClass={getZoneColor(zone.occupancy, zone.capacity, zone.type)} />
          ))}

          {/* Bottom Row Zones */}
           {zones.slice(2, 4).map(zone => (
            <ZoneBlock key={zone.id} zone={zone} containers={containers} colorClass={getZoneColor(zone.occupancy, zone.capacity, zone.type)} />
          ))}

          {/* Roadways / Truck Lanes (Visual only) */}
          <div className="absolute top-1/2 left-0 w-full h-8 -mt-4 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 flex items-center justify-center">
             <div className="w-full border-t border-dashed border-slate-300 dark:border-slate-700"></div>
             <span className="absolute bg-slate-50 dark:bg-slate-900 px-2 text-xs text-slate-400 dark:text-slate-500 font-mono tracking-widest">ГЛАВНАЯ ДОРОГА</span>
          </div>
           <div className="absolute left-1/2 top-0 h-full w-8 -ml-4 bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
             <div className="h-full border-l border-dashed border-slate-300 dark:border-slate-700"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Explicitly define Props interface and type the component as React.FC
interface ZoneBlockProps {
  zone: ZoneData;
  containers: Container[];
  colorClass: string;
}

const ZoneBlock: React.FC<ZoneBlockProps> = ({ zone, containers, colorClass }) => {
  // Filter containers for this zone (mock logic)
  const zoneContainers = containers.filter(c => c.location.zone === zone.id).slice(0, 48); // Limit for visual
  const percentage = Math.round((zone.occupancy / zone.capacity) * 100);

  // Determine progress bar color based on usage
  let barColor = 'bg-blue-500';
  if (zone.type === 'HAZMAT') barColor = 'bg-amber-500';
  else if (percentage > 90) barColor = 'bg-red-500';
  else if (percentage > 75) barColor = 'bg-orange-500';

  return (
    <div className={`rounded-xl border-2 p-4 flex flex-col ${colorClass} backdrop-blur-sm transition-all hover:scale-[1.01]`}>
      <div className="flex flex-col gap-2 mb-4 border-b border-slate-300/50 dark:border-slate-700/50 pb-2">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{zone.name}</h3>
            <span className="text-xs font-mono px-2 py-1 bg-white dark:bg-slate-900 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              {zone.type}
            </span>
        </div>
        
        {/* Occupancy Progress Bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-900/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800/50 relative">
             <div 
                className={`h-full ${barColor} transition-all duration-1000 ease-out relative`} 
                style={{ width: `${percentage}%` }}
             >
                {/* Shine effect */}
                <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
             </div>
          </div>
          <span className={`text-xs font-bold w-10 text-right ${percentage > 90 ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
             {percentage}%
          </span>
        </div>
      </div>
      
      {/* Container Grid Visualization */}
      <div className="flex-1 grid grid-cols-8 grid-rows-6 gap-1 content-start">
        {zoneContainers.map((container, idx) => {
             let bg = 'bg-blue-600';
             if (container.type === ContainerType.REEFER) bg = 'bg-emerald-500';
             if (container.type === ContainerType.TANK || zone.type === 'HAZMAT') bg = 'bg-amber-600';
             if (container.type === ContainerType.OPEN_TOP) bg = 'bg-purple-600';

             return (
               <div 
                  key={container.id} 
                  className={`relative group rounded-sm ${bg} opacity-80 hover:opacity-100 hover:scale-125 transition-all cursor-pointer h-full w-full shadow-sm`}
               >
                 {/* Tooltip */}
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-48 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs p-2 rounded border border-slate-200 dark:border-slate-700 shadow-xl pointer-events-none">
                   <p className="font-bold text-slate-900 dark:text-white">{container.code}</p>
                   <p>{container.owner}</p>
                   <p className="text-slate-500 dark:text-slate-400">{container.contentCategory}</p>
                 </div>
               </div>
             );
        })}
        {/* Fill empty slots visually if needed, or just leave blank space */}
      </div>
    </div>
  );
};

export default YardMap;