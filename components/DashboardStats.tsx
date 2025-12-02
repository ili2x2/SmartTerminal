
import React, { useState } from 'react';
import { Container, ZoneData, SystemAlert, Train, GateEntry } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  Truck,
  TrainFront,
  ClipboardList,
  ArrowUpRight,
  Clock,
  FileBarChart,
  Download,
  Printer,
  X,
  PieChart as PieIcon,
  BarChart3,
  Percent,
  Hash
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface Props {
  containers: Container[];
  zones: ZoneData[];
  alerts: SystemAlert[];
  trains: Train[];
  gates: GateEntry[];
  onNavigate: (tab: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#71717a'];

const DashboardStats: React.FC<Props> = ({ containers, zones, alerts, trains, gates, onNavigate }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [chartMode, setChartMode] = useState<'ABSOLUTE' | 'PERCENT'>('ABSOLUTE');

  const totalOccupancy = zones.reduce((acc, z) => acc + z.occupancy, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const utilization = Math.round((totalOccupancy / totalCapacity) * 100);
  
  const processingTrains = trains.filter(t => t.status === 'PROCESSING' || t.status === 'ARRIVED').length;
  const waitingTrucks = gates.filter(g => g.status === 'WAITING' || g.status === 'PROCESSING').length;

  // Prepare data for Main Chart
  const chartData = zones.map(z => ({
    name: z.id,
    used: z.occupancy,
    free: z.capacity - z.occupancy,
    percent: Math.round((z.occupancy / z.capacity) * 100),
    capacity: z.capacity,
    fullName: z.name
  }));

  // Prepare data for Pie Chart (Report)
  const typeDistribution = zones.reduce((acc, z) => {
     acc[z.type] = (acc[z.type] || 0) + z.occupancy;
     return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(typeDistribution).map(key => ({
     name: key,
     value: typeDistribution[key]
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end mb-2">
        <div>
           <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Панель управления</h2>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Сводка операционной деятельности терминала</p>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-zinc-400 dark:text-zinc-500 text-xs uppercase tracking-wider font-semibold">Системное время</p>
           <p className="text-zinc-700 dark:text-zinc-300 font-mono text-sm">{new Date().toLocaleTimeString('ru-RU')}</p>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Загрузка терминала" 
          value={`${utilization}%`} 
          subValue={`${totalOccupancy} / ${totalCapacity} TEU`}
          icon={<Activity size={24} className="text-blue-500 dark:text-blue-400" />}
          trend={utilization > 85 ? 'negative' : 'positive'}
          trendValue={utilization > 85 ? 'Высокая' : 'Норма'}
        />
        <StatCard 
          title="Ж/Д Операции" 
          value={processingTrains.toString()} 
          subValue="Составов в работе"
          icon={<TrainFront size={24} className="text-emerald-500 dark:text-emerald-400" />}
          trend="neutral"
          trendValue="По графику"
        />
        <StatCard 
          title="Очередь на КПП" 
          value={waitingTrucks.toString()} 
          subValue="Траков ожидает"
          icon={<Truck size={24} className="text-amber-500 dark:text-amber-400" />}
          trend={waitingTrucks > 5 ? 'negative' : 'positive'}
          trendValue={waitingTrucks > 5 ? 'Задержка' : 'Норма'}
        />
        <StatCard 
          title="Системные алерты" 
          value={alerts.length.toString()} 
          subValue="Требуют внимания"
          icon={<AlertTriangle size={24} className="text-red-500 dark:text-red-400" />}
          trend="negative"
          trendValue="+2"
          isAlert
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center text-zinc-900 dark:text-white">
              <BarChart3 className="mr-2 text-blue-500" size={20} />
              Распределение грузов по зонам
            </h3>
            <div className="flex gap-2">
               <div className="flex bg-zinc-100 dark:bg-zinc-950 rounded p-1 border border-zinc-200 dark:border-zinc-800">
                  <button 
                    onClick={() => setChartMode('ABSOLUTE')}
                    className={`p-1.5 rounded text-xs transition-colors ${chartMode === 'ABSOLUTE' ? 'bg-white dark:bg-zinc-800 shadow text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                    title="В единицах (TEU)"
                  >
                     <Hash size={16}/>
                  </button>
                  <button 
                    onClick={() => setChartMode('PERCENT')}
                    className={`p-1.5 rounded text-xs transition-colors ${chartMode === 'PERCENT' ? 'bg-white dark:bg-zinc-800 shadow text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                    title="В процентах (%)"
                  >
                     <Percent size={16}/>
                  </button>
               </div>
               <button 
                  onClick={() => setShowReportModal(true)}
                  className="text-xs bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded border border-blue-200 dark:border-blue-500/20 transition-colors flex items-center gap-1"
                >
                  <FileBarChart size={14}/> Детальный отчет
               </button>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#71717a" tick={{fill: '#71717a'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" tick={{fill: '#71717a'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded shadow-xl">
                          <p className="font-bold text-zinc-900 dark:text-white mb-1">{data.fullName}</p>
                          <div className="text-xs space-y-1">
                             <p className="text-zinc-500 flex justify-between gap-4"><span>Занято:</span> <span className="font-mono text-zinc-900 dark:text-white">{data.used} TEU</span></p>
                             <p className="text-zinc-500 flex justify-between gap-4"><span>Свободно:</span> <span className="font-mono text-zinc-900 dark:text-white">{data.free} TEU</span></p>
                             <div className="w-full h-px bg-zinc-200 dark:bg-zinc-700 my-1"></div>
                             <p className={`${data.percent > 90 ? 'text-red-500 font-bold' : 'text-blue-500 font-bold'} flex justify-between gap-4`}>
                               <span>Загрузка:</span> <span>{data.percent}%</span>
                             </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{fill: '#d4d4d8', opacity: 0.1}}
                />
                <Bar 
                   dataKey={chartMode === 'PERCENT' ? 'percent' : 'used'} 
                   name="Занято" 
                   stackId="a" 
                   fill="#3b82f6" 
                   radius={chartMode === 'PERCENT' ? [0,0,0,0] : [0,0,0,0]} 
                />
                {chartMode === 'ABSOLUTE' && (
                    <Bar dataKey="free" name="Свободно" stackId="a" fill="#e4e4e7" className="dark:fill-zinc-800" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-zinc-500">
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Занято
             </div>
             {chartMode === 'ABSOLUTE' && (
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-sm"></span> Свободно
                </div>
             )}
          </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Оперативная сводка</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {alerts.map(alert => (
                 <div key={alert.id} className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    <div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{alert.category}</span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-600 flex items-center gap-1"><Clock size={10}/> {alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-200 mt-0.5 leading-snug">{alert.message}</p>
                    </div>
                 </div>
            ))}
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-lg">
               <div className="flex items-center gap-2 mb-2">
                 <ClipboardList size={16} className="text-blue-500 dark:text-blue-400"/>
                 <span className="text-sm font-medium text-blue-700 dark:text-blue-200">План смены</span>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>Выгрузка KZT-8821</span>
                    <span className="text-emerald-500 dark:text-emerald-400">45%</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[45%]"></div>
                  </div>
               </div>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('ops')}
            className="mt-4 w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Перейти в Центр Управления <ArrowUpRight size={14}/>
          </button>
        </div>
      </div>

      {/* --- DETAILED REPORT MODAL --- */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
             
             {/* Header */}
             <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <FileBarChart size={20}/>
                   </div>
                   <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Отчет по состоянию терминала</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">Дата формирования: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                   </div>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><X size={24}/></button>
             </div>

             {/* Content */}
             <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                
                {/* 1. Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-500 uppercase font-bold">Общая вместимость</p>
                      <p className="text-2xl font-mono font-bold text-zinc-900 dark:text-white mt-1">{totalCapacity} <span className="text-sm font-sans font-normal text-zinc-500">TEU</span></p>
                   </div>
                   <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-500 uppercase font-bold">В наличии на складе</p>
                      <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">{totalOccupancy} <span className="text-sm font-sans font-normal text-zinc-500">TEU</span></p>
                   </div>
                   <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <p className="text-xs text-zinc-500 uppercase font-bold">Доступный резерв</p>
                      <p className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalCapacity - totalOccupancy} <span className="text-sm font-sans font-normal text-zinc-500">TEU</span></p>
                   </div>
                </div>

                {/* 2. Breakdown Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   
                   {/* Table */}
                   <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                         <BarChart3 size={16} className="text-zinc-400"/> Детализация по зонам
                      </h4>
                      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                         <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-100 dark:bg-zinc-950 text-zinc-500 font-medium">
                               <tr>
                                  <th className="px-4 py-2">Зона</th>
                                  <th className="px-4 py-2">Занято</th>
                                  <th className="px-4 py-2">Прогресс</th>
                                  <th className="px-4 py-2 text-right">Статус</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                               {zones.map(z => {
                                  const pct = Math.round((z.occupancy / z.capacity) * 100);
                                  return (
                                     <tr key={z.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                        <td className="px-4 py-2">
                                           <div className="font-bold text-zinc-800 dark:text-zinc-200">{z.id}</div>
                                           <div className="text-[10px] text-zinc-500">{z.type}</div>
                                        </td>
                                        <td className="px-4 py-2 font-mono text-zinc-600 dark:text-zinc-300">{z.occupancy}/{z.capacity}</td>
                                        <td className="px-4 py-2 w-32">
                                           <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                              <div className={`h-full ${pct > 90 ? 'bg-red-500' : pct > 75 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{width: `${pct}%`}}></div>
                                           </div>
                                           <div className="text-[10px] text-right mt-0.5 text-zinc-400">{pct}%</div>
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                           {pct > 90 
                                              ? <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">CRITICAL</span> 
                                              : pct > 75
                                              ? <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">WARN</span>
                                              : <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">OK</span>
                                           }
                                        </td>
                                     </tr>
                                  );
                               })}
                            </tbody>
                         </table>
                      </div>
                   </div>

                   {/* Pie Chart */}
                   <div className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2 w-full">
                         <PieIcon size={16} className="text-zinc-400"/> Структура хранения
                      </h4>
                      <div className="w-full h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                               >
                                  {pieData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                               </Pie>
                               <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                               <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <p className="text-xs text-zinc-500 text-center mt-2 max-w-xs">
                         Диаграмма отображает распределение контейнеров по функциональным типам зон терминала.
                      </p>
                   </div>

                </div>

             </div>

             {/* Footer Actions */}
             <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                <button 
                   onClick={() => setShowReportModal(false)}
                   className="px-4 py-2 rounded text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                >
                   Закрыть
                </button>
                <button className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded text-sm font-medium flex items-center gap-2 transition-colors">
                   <Printer size={16}/> Печать
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20">
                   <Download size={16}/> Скачать PDF
                </button>
             </div>

          </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ title, value, subValue, icon, trend, trendValue, isAlert }: any) => (
  <div className={`p-5 rounded-xl border transition-all hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 shadow-sm ${
    isAlert 
    ? 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-500/20' 
    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
  }`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
        {icon}
      </div>
      <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
        trend === 'positive' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10' : 
        trend === 'negative' ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10' : 'text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-400/10'
      }`}>
        {trendValue}
      </div>
    </div>
    <div className="space-y-1">
      <h4 className="text-zinc-500 dark:text-zinc-400 text-xs font-medium uppercase tracking-wider">{title}</h4>
      <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-zinc-500 text-xs">{subValue}</p>
    </div>
  </div>
);

export default DashboardStats;
