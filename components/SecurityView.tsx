
import React, { useState } from 'react';
import { SecurityCamera, SecurityIncident } from '../types';
import { 
  Cctv, 
  AlertTriangle, 
  Activity, 
  Maximize2, 
  Disc, 
  Wifi, 
  WifiOff, 
  Search,
  ChevronRight,
  ShieldAlert,
  ThermometerSun,
  Move
} from 'lucide-react';

interface Props {
  cameras: SecurityCamera[];
  incidents: SecurityIncident[];
}

const SecurityView: React.FC<Props> = ({ cameras, incidents }) => {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [activeCamera, setActiveCamera] = useState<SecurityCamera | null>(null);

  const zones = ['ALL', ...Array.from(new Set(cameras.map(c => c.zone)))];

  const filteredCameras = selectedZone === 'ALL' 
    ? cameras 
    : cameras.filter(c => c.zone === selectedZone);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
             <ShieldAlert className="text-blue-600 dark:text-blue-400" />
             Центр безопасности
           </h2>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm">Мониторинг периметра и технологических процессов 24/7</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                 <p className="text-[10px] text-zinc-500 uppercase font-bold">Система</p>
                 <p className="text-sm font-bold text-zinc-900 dark:text-white">ONLINE</p>
              </div>
           </div>
           <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                 <p className="text-[10px] text-zinc-500 uppercase font-bold">Инциденты</p>
                 <p className="text-sm font-bold text-zinc-900 dark:text-white">{incidents.filter(i => i.status !== 'RESOLVED').length} Активных</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        
        {/* Main Video Wall */}
        <div className="xl:col-span-3 flex flex-col gap-4 h-full">
           
           {/* Filters */}
           <div className="flex gap-2 overflow-x-auto pb-2">
             {zones.map(zone => (
               <button 
                 key={zone}
                 onClick={() => setSelectedZone(zone)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                   selectedZone === zone 
                   ? 'bg-blue-600 text-white' 
                   : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                 }`}
               >
                 {zone === 'ALL' ? 'ВСЕ ЗОНЫ' : zone}
               </button>
             ))}
           </div>

           {/* Grid */}
           <div className="flex-1 bg-black/5 dark:bg-black/20 rounded-xl overflow-y-auto custom-scrollbar p-1">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
                {filteredCameras.map(cam => (
                  <CameraFeed key={cam.id} camera={cam} onClick={() => setActiveCamera(cam)} />
                ))}
             </div>
           </div>
        </div>

        {/* Sidebar Controls */}
        <div className="xl:col-span-1 flex flex-col gap-4 h-full overflow-hidden">
           
           {/* Incident Log */}
           <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                 <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-500"/> Журнал тревог
                 </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                 {incidents.map(inc => (
                    <div key={inc.id} className="p-3 rounded border bg-zinc-50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800 hover:border-blue-500 cursor-pointer transition-colors group">
                       <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] px-1.5 rounded font-bold ${
                             inc.type === 'MOTION' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                             inc.type === 'ACCESS_DENIED' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                             'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                          }`}>
                             {inc.type}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">{inc.timestamp}</span>
                       </div>
                       <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mb-1">{inc.location}</p>
                       <div className="flex justify-between items-center">
                          <span className={`text-[10px] ${
                             inc.status === 'NEW' ? 'text-red-500 font-bold animate-pulse' : 'text-zinc-500'
                          }`}>
                             {inc.status}
                          </span>
                          <ChevronRight size={14} className="text-zinc-300 dark:text-zinc-700 group-hover:text-blue-500"/>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* PTZ Controls Mockup */}
           <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-center relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 to-zinc-950 pointer-events-none"></div>
              <h3 className="text-xs text-zinc-400 uppercase font-bold mb-4 relative z-10">Управление PTZ</h3>
              
              <div className="relative w-32 h-32 mx-auto bg-zinc-800 rounded-full border border-zinc-700 flex items-center justify-center shadow-inner z-10">
                 <button className="absolute top-2 left-1/2 -translate-x-1/2 p-2 hover:text-blue-400 text-zinc-500 transition-colors"><ChevronRight className="-rotate-90"/></button>
                 <button className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 hover:text-blue-400 text-zinc-500 transition-colors"><ChevronRight className="rotate-90"/></button>
                 <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 hover:text-blue-400 text-zinc-500 transition-colors"><ChevronRight className="rotate-180"/></button>
                 <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-blue-400 text-zinc-500 transition-colors"><ChevronRight/></button>
                 <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer">
                    <Move size={20} className="text-zinc-300"/>
                 </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-6 relative z-10">
                 <button className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 hover:border-blue-500 hover:text-blue-400 transition-colors">ZOOM +</button>
                 <button className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 hover:border-blue-500 hover:text-blue-400 transition-colors">ZOOM -</button>
              </div>
           </div>

        </div>
      </div>
      
      {/* Modal for Fullscreen Camera */}
      {activeCamera && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col animate-in fade-in duration-200">
           <div className="flex justify-between items-center p-4 bg-zinc-900 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 <h2 className="text-white font-mono text-lg">{activeCamera.name} <span className="text-zinc-500 text-sm">/ {activeCamera.zone}</span></h2>
              </div>
              <button onClick={() => setActiveCamera(null)} className="text-white hover:text-red-500 transition-colors p-2 bg-zinc-800 rounded">Закрыть</button>
           </div>
           <div className="flex-1 bg-zinc-950 relative flex items-center justify-center">
              <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none">
                 <span className="text-green-500 font-mono text-xl drop-shadow-md">LIVE</span>
                 <span className="text-white font-mono text-sm">{new Date().toLocaleString()}</span>
              </div>
              <Cctv size={64} className="text-zinc-800" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-zinc-800/80 rounded-full text-white text-sm backdrop-blur-md border border-zinc-700">
                 Режим полноэкранного просмотра
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

const CameraFeed: React.FC<{ camera: SecurityCamera, onClick: () => void }> = ({ camera, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 group cursor-pointer hover:border-blue-500 transition-colors ${camera.status === 'OFFLINE' ? 'opacity-50' : ''}`}
    >
       {/* Status Overlay */}
       <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white backdrop-blur-md ${
             camera.status === 'RECORDING' ? 'bg-red-500/80' : 
             camera.status === 'ALERT' ? 'bg-amber-500/80 animate-pulse' :
             camera.status === 'OFFLINE' ? 'bg-zinc-600' : 'bg-emerald-500/80'
          }`}>
             {camera.status === 'RECORDING' ? 'REC' : camera.status}
          </span>
          <span className="text-[10px] text-white/80 drop-shadow-md font-mono bg-black/30 px-1 rounded">{camera.id}</span>
       </div>

       <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 bg-black/50 text-white rounded hover:bg-blue-600 transition-colors">
             <Maximize2 size={14}/>
          </button>
       </div>

       {/* Feed Content Placeholder */}
       <div className="w-full h-full bg-zinc-900 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
          {camera.status === 'OFFLINE' ? (
             <div className="flex flex-col items-center gap-2 text-zinc-700">
                <WifiOff size={32}/>
                <span className="text-xs font-mono">NO SIGNAL</span>
             </div>
          ) : (
             <>
               {/* Background Grid/Simulation */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .3) 25%, rgba(255, 255, 255, .3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .3) 75%, rgba(255, 255, 255, .3) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }}></div>
               
               {/* Icon representing feed type */}
               <div className="text-zinc-800 dark:text-zinc-700">
                 {camera.type === 'THERMAL' ? <ThermometerSun size={48} className="text-amber-900/50"/> : <Cctv size={48}/>}
               </div>

               {/* Random UI Elements overlay */}
               <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-[9px] text-white/70 font-mono">
                  <span>{camera.name}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
               </div>
               
               {/* Recording Dot */}
               {camera.status === 'RECORDING' && (
                  <div className="absolute bottom-3 right-16 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
               )}
             </>
          )}
       </div>
    </div>
  );
};

export default SecurityView;
