
import React, { useState, useEffect } from 'react';
import { ZoneData, Container, ContainerType } from '../types';
import { Container as ContainerIcon, AlertTriangle, X, Info, Box } from 'lucide-react';

interface Props {
  zones: ZoneData[];
  containers: Container[];
}

const YardMap: React.FC<Props> = ({ zones, containers }) => {
  const [notifications, setNotifications] = useState<{id: string, message: string}[]>([]);

  // Monitor zones for critical occupancy levels
  useEffect(() => {
    const criticalZones = zones.filter(z => (z.occupancy / z.capacity) > 0.9);
    
    if (criticalZones.length > 0) {
        const newAlerts = criticalZones.map(z => ({
            id: z.id,
            message: `Критическая загрузка: ${z.name} заполнен на ${Math.round((z.occupancy / z.capacity) * 100)}%`
        }));
        setNotifications(newAlerts);
    } else {
        setNotifications([]);
    }
  }, [zones]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative h-full animate-in fade-in duration-500 pb-10">
      
      {/* Toast Notifications Layer */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map(note => (
          <div key={note.id} className="pointer-events-auto bg-red-500 text-white p-4 rounded-lg shadow-lg shadow-red-500/30 flex items-start gap-3 w-80 animate-in slide-in-from-right duration-300">
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1">
               <h4 className="font-bold text-sm">Внимание!</h4>
               <p className="text-xs opacity-90">{note.message}</p>
            </div>
            <button onClick={() => removeNotification(note.id)} className="hover:bg-white/20 rounded p-1 transition-colors">
               <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Карта терминала (YARD)</h2>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm">Визуализация секторов хранения и Ж/Д путей</p>
        </div>
        <div className="flex gap-4 text-xs">
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
              <span className="text-zinc-600 dark:text-zinc-300">Импорт</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
              <span className="text-zinc-600 dark:text-zinc-300">Экспорт</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
              <span className="text-zinc-600 dark:text-zinc-300">Hazmat</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {zones.map(zone => (
          <ZoneBlock 
            key={zone.id} 
            zone={zone} 
            containers={containers.filter(c => c.location.zone === zone.id)} 
          />
        ))}
      </div>
    </div>
  );
};

const ZoneBlock: React.FC<{ zone: ZoneData, containers: Container[] }> = ({ zone, containers }) => {
  const percentage = Math.round((zone.occupancy / zone.capacity) * 100);
  
  // Determine color based on zone type
  const getTypeColor = (type: string) => {
     switch(type) {
         case 'IMPORT': return 'border-t-blue-500';
         case 'EXPORT': return 'border-t-emerald-500';
         case 'HAZMAT': return 'border-t-amber-500';
         case 'EMPTY': return 'border-t-zinc-400';
         case 'RAIL_SIDE': return 'border-t-purple-500';
         default: return 'border-t-zinc-500';
     }
  };

  const getProgressColor = (percent: number) => {
     if (percent > 90) return 'bg-red-500';
     if (percent > 75) return 'bg-amber-500';
     return 'bg-blue-500';
  };

  const visualSlots = 24;
  const occupiedSlots = Math.ceil((zone.occupancy / zone.capacity) * visualSlots);

  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm border-t-4 ${getTypeColor(zone.type)} hover:shadow-md transition-shadow relative overflow-hidden`}>
       {/* Header */}
       <div className="flex justify-between items-start mb-4">
          <div>
             <h3 className="font-bold text-zinc-900 dark:text-white text-lg">{zone.name}</h3>
             <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">ID: {zone.id} • {zone.type}</p>
          </div>
          <div className="text-right">
             <p className="text-2xl font-bold text-zinc-900 dark:text-white">{percentage}%</p>
             <p className="text-xs text-zinc-500">{zone.occupancy} / {zone.capacity} TEU</p>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="w-full bg-zinc-100 dark:bg-zinc-950 h-2 rounded-full mb-6 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(percentage)}`} 
            style={{ width: `${percentage}%` }}
          ></div>
       </div>

       {/* Visual Grid of Containers */}
       <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: visualSlots }).map((_, idx) => {
             const isOccupied = idx < occupiedSlots;
             // Try to map a specific container to this slot if available
             const containerData = isOccupied ? containers[idx] : null;

             return (
               <div key={idx} className="relative group">
                  <div 
                    className={`h-8 rounded-sm transition-colors ${
                       isOccupied 
                       ? 'bg-zinc-300 dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-600 cursor-help' 
                       : 'bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/50 border-dashed'
                    } ${containerData && containerData.type === 'REEFER' ? 'border-b-4 border-b-emerald-500' : ''} ${containerData && containerData.type === 'TANK' ? 'border-b-4 border-b-amber-500' : ''}`}
                  >
                  </div>
                  
                  {/* Tooltip on Hover for Occupied Slots */}
                  {isOccupied && (
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                        {containerData ? (
                            <>
                              <div className="font-bold border-b border-zinc-600 pb-1 mb-1 flex justify-between">
                                 <span>{containerData.code}</span>
                                 <span className="text-zinc-400">{containerData.size}'</span>
                              </div>
                              <div className="space-y-0.5">
                                 <p><span className="text-zinc-400">Владелец:</span> {containerData.owner}</p>
                                 <p><span className="text-zinc-400">Груз:</span> {containerData.contentCategory}</p>
                                 <p><span className="text-zinc-400">Тип:</span> {containerData.type}</p>
                              </div>
                              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800 rotate-45"></div>
                            </>
                        ) : (
                            <div className="text-center italic text-zinc-400">Груз (Схематично)</div>
                        )}
                     </div>
                  )}
               </div>
             );
          })}
       </div>
       
       {/* Footer Info */}
       <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between text-[10px] text-zinc-400">
          <span>Сектор активен</span>
          <span>Обновлено: {new Date().toLocaleTimeString()}</span>
       </div>
    </div>
  );
};

export default YardMap;
