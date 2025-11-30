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
  Moon
} from 'lucide-react';
import { 
  Container, ZoneData, SystemAlert, Train, OperationTask, GateEntry, WarehouseItem, ClientOrder 
} from './types';
import { 
  MOCK_CONTAINERS, MOCK_ZONES, MOCK_ALERTS, MOCK_TRAINS, MOCK_TASKS, MOCK_GATES, MOCK_WAREHOUSE, MOCK_ORDERS 
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

// Main App Component
const App: React.FC = () => {
  // Simulate Backend State - Loaded from Constants
  const [containers] = useState<Container[]>(MOCK_CONTAINERS);
  const [zones] = useState<ZoneData[]>(MOCK_ZONES);
  const [alerts] = useState<SystemAlert[]>(MOCK_ALERTS);
  const [trains] = useState<Train[]>(MOCK_TRAINS);
  const [tasks] = useState<OperationTask[]>(MOCK_TASKS);
  const [gates] = useState<GateEntry[]>(MOCK_GATES);
  const [warehouse] = useState<WarehouseItem[]>(MOCK_WAREHOUSE);
  const [orders] = useState<ClientOrder[]>(MOCK_ORDERS);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'yard' | 'containers' | 'ops' | 'gate' | 'wms' | 'orders' | 'ai'>('dashboard');
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
        return <OperationsView trains={trains} tasks={tasks} />;
      case 'gate':
        return <GateView gates={gates} />;
      case 'wms':
        return <WarehouseView inventory={warehouse} />;
      case 'orders':
        return <OrdersView orders={orders} />;
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20`}
      >
        <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-md">
             <span className="font-bold text-white">S</span>
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight text-slate-900 dark:text-white">Smart<span className="text-blue-600">Terminal</span></span>}
        </div>

        <nav className="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto custom-scrollbar">
          <p className={`text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 px-3 ${!sidebarOpen && 'hidden'}`}>Основное</p>
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Обзор" 
            isActive={activeTab === 'dashboard'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<MapIcon size={20} />} 
            label="Карта терминала" 
            isActive={activeTab === 'yard'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('yard')} 
          />
          
          <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
          <p className={`text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 px-3 ${!sidebarOpen && 'hidden'}`}>Операции</p>
          
          <NavItem 
            icon={<TrainFront size={20} />} 
            label="Ж/Д и Задачи" 
            isActive={activeTab === 'ops'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('ops')} 
          />
           <NavItem 
            icon={<ShieldCheck size={20} />} 
            label="Smart Gate" 
            isActive={activeTab === 'gate'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('gate')} 
          />
           <NavItem 
            icon={<Package size={20} />} 
            label="Склад (WMS)" 
            isActive={activeTab === 'wms'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('wms')} 
          />
          <NavItem 
            icon={<Box size={20} />} 
            label="Контейнеры" 
            isActive={activeTab === 'containers'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('containers')} 
          />

          <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
          <p className={`text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-2 px-3 ${!sidebarOpen && 'hidden'}`}>Бизнес</p>

          <NavItem 
            icon={<FileText size={20} />} 
            label="Коммерция" 
            isActive={activeTab === 'orders'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('orders')} 
          />

          <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>
          
          <NavItem 
            icon={<Bot size={20} />} 
            label="AI Директор" 
            isActive={activeTab === 'ai'} 
            expanded={sidebarOpen} 
            onClick={() => setActiveTab('ai')} 
            isSpecial
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
              OK
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Олег Кузнецов</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Старший диспетчер</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 transition-colors duration-300">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 mr-4 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Поиск по системе (Контейнер, ID, Док)..." 
                className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-80 transition-all text-slate-900 dark:text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
             {/* Theme Toggle */}
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
             >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             <div className="hidden md:flex items-center text-xs space-x-4 mr-4">
                <span className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">RU</span>
                <span className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">EN</span>
                <span className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">中文</span>
             </div>
             
             <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

             <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-400/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                SMART ONLINE
             </div>
             <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
               <Bell size={20} />
               {alerts.length > 0 && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-950"></span>
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
const NavItem = ({ icon, label, isActive, expanded, onClick, isSpecial }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative ${
      isActive 
        ? isSpecial 
          ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-600/20 dark:to-blue-600/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
          : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    {isActive && !isSpecial && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-300 rounded-r-full blur-[2px]"></div>}
    <span className={`${isActive ? 'text-white' : ''}`}>{icon}</span>
    {expanded && (
      <span className={`ml-3 font-medium text-sm whitespace-nowrap`}>
        {label}
      </span>
    )}
    {expanded && isSpecial && (
      <span className="ml-auto text-[10px] bg-purple-100 dark:bg-purple-500/80 text-purple-700 dark:text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider shadow-sm">
        AI
      </span>
    )}
  </button>
);

export default App;