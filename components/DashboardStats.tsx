import React from 'react';
import { Container, ZoneData, SystemAlert, Train, GateEntry } from '../types';
import { 
  Activity, 
  AlertTriangle, 
  Truck,
  TrainFront,
  ClipboardList,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  containers: Container[];
  zones: ZoneData[];
  alerts: SystemAlert[];
  trains: Train[];
  gates: GateEntry[];
  onNavigate: (tab: string) => void;
}

const DashboardStats: React.FC<Props> = ({ containers, zones, alerts, trains, gates, onNavigate }) => {
  const totalOccupancy = zones.reduce((acc, z) => acc + z.occupancy, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const utilization = Math.round((totalOccupancy / totalCapacity) * 100);
  
  const processingTrains = trains.filter(t => t.status === 'PROCESSING' || t.status === 'ARRIVED').length;
  const waitingTrucks = gates.filter(g => g.status === 'WAITING' || g.status === 'PROCESSING').length;

  const chartData = zones.map(z => ({
    name: z.id,
    used: z.occupancy,
    free: z.capacity - z.occupancy
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end mb-2">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Панель управления</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Сводка операционной деятельности терминала</p>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider font-semibold">Системное время</p>
           <p className="text-slate-700 dark:text-slate-300 font-mono text-sm">{new Date().toLocaleTimeString('ru-RU')}</p>
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
          trendValue="+1.2%"
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
        <div className="lg:col-span-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center text-slate-900 dark:text-white">
              <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
              Распределение грузов по зонам
            </h3>
            <button className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300">Детальный отчет →</button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40}>
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg)', borderColor: 'var(--tooltip-border)', color: 'var(--tooltip-text)' }}
                  wrapperClassName="dark:!bg-slate-900 !bg-white dark:!border-slate-800 !border-slate-200 rounded shadow-lg"
                  cursor={{fill: '#cbd5e1', opacity: 0.2}}
                />
                <Bar dataKey="used" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="free" stackId="a" fill="#e2e8f0" className="dark:fill-slate-800" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Recent */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Оперативная сводка</h3>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {alerts.map(alert => (
                 <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer">
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.severity === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></div>
                    <div>
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{alert.category}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-600 flex items-center gap-1"><Clock size={10}/> {alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">{alert.message}</p>
                    </div>
                 </div>
            ))}
            
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-lg">
               <div className="flex items-center gap-2 mb-2">
                 <ClipboardList size={16} className="text-blue-500 dark:text-blue-400"/>
                 <span className="text-sm font-medium text-blue-700 dark:text-blue-200">План смены</span>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Выгрузка KZT-8821</span>
                    <span className="text-emerald-500 dark:text-emerald-400">45%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[45%]"></div>
                  </div>
               </div>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('ops')}
            className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Перейти в Центр Управления <ArrowUpRight size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon, trend, trendValue, isAlert }: any) => (
  <div className={`p-5 rounded-xl border transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 shadow-sm ${
    isAlert 
    ? 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-500/20' 
    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
  }`}>
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
        {icon}
      </div>
      <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
        trend === 'positive' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10' : 
        trend === 'negative' ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-400/10' : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-400/10'
      }`}>
        {trendValue}
      </div>
    </div>
    <div className="space-y-1">
      <h4 className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</h4>
      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-slate-500 text-xs">{subValue}</p>
    </div>
  </div>
);

export default DashboardStats;