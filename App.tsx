
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Box, 
  Bot, 
  Bell, 
  Search, 
  Menu,
  Anchor,
  TrainFront,
  ShieldCheck,
  Package,
  FileText,
  Sun,
  Moon,
  Cctv
} from 'lucide-react';
import { 
  Container, ZoneData, SystemAlert, Train, OperationTask, GateEntry, WarehouseItem, ClientOrder, SecurityCamera, SecurityIncident
} from './types';
import { 
  MOCK_CONTAINERS, MOCK_ZONES, MOCK_ALERTS, MOCK_TRAINS, MOCK_TASKS, MOCK_GATES, MOCK_WAREHOUSE, MOCK_ORDERS, MOCK_CAMERAS, MOCK_INCIDENTS
} from './constants';

// Component Imports
import DashboardStats from './components/DashboardStats';
import YardMap from './components/YardMap';
import ContainerList from './components/ContainerList';
import AIConsultant from './components/AIConsultant';
import OperationsView from './components/OperationsView';
import GateView from './components/GateView';
import WarehouseView from './components/WarehouseView';
import OrdersView from './components/OrdersView';
import SecurityView from './components/SecurityView';

// Main App Component
const App: React.FC = () => {
  // Simulate Backend State - Loaded from Constants
  const [containers] = useState<Container[]>(MOCK_CONTAINERS);
  const [zones] = useState<ZoneData[]>(MOCK_ZONES);
  const [alerts] = useState<SystemAlert[]>(MOCK_ALERTS);
  const [trains] = useState<Train[]>(MOCK_TRAINS);
  const [tasks, setTasks] = useState<OperationTask[]>(MOCK_TASKS);
  const [gates] = useState<GateEntry[]>(MOCK_GATES);
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>(MOCK_WAREHOUSE);
  const [orders, setOrders] = useState<ClientOrder[]>(MOCK_ORDERS);
  const [cameras] = useState<SecurityCamera[]>(MOCK_CAMERAS);
  const [incidents] = useState<SecurityIncident[]>(MOCK_INCIDENTS);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'yard' | 'containers' | 'ops' | 'gate' | 'wms' | 'orders' | 'ai' | 'security'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(true);

  // Apply Theme Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Calculate Notification Counts ---
  const alertsCount = alerts.length;
  // Ops: Pending tasks + Processing trains
  const opsCount = tasks.filter(t => t.status === 'PENDING').length + trains.filter(t => t.status === 'PROCESSING').length;
  // Gate: Waiting or Processing trucks
  const gateCount = gates.filter(g => g.status === 'WAITING' || g.status === 'PROCESSING').length;
  // WMS: Items with low quantity (< 200 for demo)
  const wmsCount = warehouse.filter(w => w.quantity <= 200).length;
  // Containers: Maintenance or Blocked
  const containersMaintenanceCount = containers.filter(c => c.status === 'MAINTENANCE').length;
  // Orders: Submitted or Draft
  const ordersPendingCount = orders.filter(o => o.status === 'SUBMITTED' || o.status === 'DRAFT').length;
  // Security Incidents
  const securityCount = incidents.filter(i => i.status === 'NEW').length;


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats 
                  containers={containers} 
                  zones={zones} 
                  alerts={alerts} 
                  trains={trains} 
                  gates={gates} 
                  onNavigate={(tab: any) => setActiveTab(tab)}
               />;
      case 'yard':
        return <YardMap zones={zones} containers={containers} />;
      case 'containers':
        return <ContainerList containers={containers} />;
      case 'ops':
        return <OperationsView trains={trains} tasks={tasks} setTasks={setTasks} />;
      case 'gate':
        return <GateView gates={gates} />;
      case 'wms':
        return <WarehouseView inventory={warehouse} setInventory={setWarehouse} />;
      case 'orders':
        return <OrdersView orders={orders} setOrders={setOrders} />;
      case 'security':
        return <SecurityView cameras={cameras} incidents={incidents} />;
      case 'ai':
        return <AIConsultant containers={containers} zones={zones} alerts={alerts} />; 
      default:
        return <DashboardStats 
                  containers={containers} 
                  zones={zones} 
                  alerts={alerts} 
                  trains={trains} 
                  gates={gates} 
                  onNavigate={(tab: any) => setActiveTab(tab)}
               />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 flex flex-col z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-md flex-shrink-0">
             <span className="font-bold text-white">S</span>
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">Smart<span className="text-blue-600">Terminal</span></span>}
        </div>

        <nav className="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto custom-scrollbar">
          <p className={`text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-2 px-3 ${!sidebarOpen && 'hidden'}`}>Основное</p>
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Обзор" 
            isActive={activeTab === 'dashboard'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('dashboard')} 
            badge={alertsCount}
          />
          <NavItem 
            icon={<MapIcon size={20} />} 
            label="Карта терминала" 
            isActive={activeTab === 'yard'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('yard')} 
          />
          
          <div className="my-2 border-t border-zinc-200 dark:border-zinc-800"></div>
          <p className={`text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-2 px-3 ${!sidebarOpen && 'hidden'}`}>Операции</p>
          
          <NavItem 
            icon={<TrainFront size={20} />} 
            label="Ж/Д и Задачи" 
            isActive={activeTab === 'ops'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('ops')} 
            badge={opsCount}
          />
           <NavItem 
            icon={<ShieldCheck size={20} />} 
            label="Smart Gate" 
            isActive={activeTab === 'gate'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('gate')} 
            badge={gateCount}
          />
          <NavItem 
            icon={<Cctv size={20} />} 
            label="Безопасность" 
            isActive={activeTab === 'security'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('security')} 
            badge={securityCount}
          />
           <NavItem 
            icon={<Package size={20} />} 
            label="Склад (WMS)" 
            isActive={activeTab === 'wms'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('wms')} 
            badge={wmsCount}
          />
          <NavItem 
            icon={<Box size={20} />} 
            label="Контейнеры" 
            isActive={activeTab === 'containers'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('containers')} 
            badge={containersMaintenanceCount}
          />

          <div className="my-2 border-t border-zinc-200 dark:border-zinc-800"></div>
          <p className={`text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mb-2 px-3 ${!sidebarOpen && 'hidden'}`}>Бизнес</p>

          <NavItem 
            icon={<FileText size={20} />} 
            label="Коммерция" 
            isActive={activeTab === 'orders'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('orders')} 
            badge={ordersPendingCount}
          />

          <div className="my-2 border-t border-zinc-200 dark:border-zinc-800"></div>
          
          <NavItem 
            icon={<Bot size={20} />} 
            label="AI Директор" 
            isActive={activeTab === 'ai'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('ai')} 
            isSpecial
          />
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300 flex-shrink-0">
              OK
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">Олег Кузнецов</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">Старший диспетчер</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 z-10 transition-colors duration-300">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 mr-4 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Поиск по системе (Контейнер, ID, Док)..." 
                className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-80 transition-all text-zinc-900 dark:text-zinc-200 placeholder-zinc-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
             {/* Theme Toggle */}
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
             >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             <div className="hidden md:flex items-center text-xs space-x-4 mr-4">
                <span className="font-bold text-zinc-900 dark:text-white cursor-default border-b-2 border-blue-600 dark:border-blue-400 pb-0.5">RU</span>
             </div>
             
             <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>

             <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-400/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                SMART ONLINE
             </div>
             <button className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
               <Bell size={20} />
               {alerts.length > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-900"></span>
               )}
             </button>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Navigation Items
const NavItem = ({ icon, label, isActive, expanded, onClick, isSpecial, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative ${
      isActive 
        ? isSpecial 
          ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-600/20 dark:to-blue-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
          : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50' 
        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
    }`}
  >
    {isActive && !isSpecial && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-full blur-[2px]"></div>}
    
    <div className="relative flex-shrink-0">
        <span className={`${isActive ? 'text-white' : ''}`}>{icon}</span>
        {/* Collapsed state badge */}
        {!expanded && badge > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white dark:border-zinc-900"></span>
            </span>
        )}
    </div>

    {expanded && (
      <div className="ml-3 flex-1 flex items-center justify-between overflow-hidden">
        <span className={`font-medium text-sm whitespace-nowrap`}>
            {label}
        </span>
        {isSpecial ? (
             <span className="ml-auto text-[10px] bg-purple-100 dark:bg-purple-500/80 text-purple-700 dark:text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider shadow-sm">
                AI
             </span>
        ) : badge > 0 && (
             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center ml-2 ${
                 isActive 
                 ? 'bg-blue-500 text-white border border-blue-400' 
                 : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
             }`}>
                {badge}
             </span>
        )}
      </div>
    )}
  </button>
);

export default App;
