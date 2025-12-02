
import React, { useState } from 'react';
import { Train, OperationTask } from '../types';
import { generateOperationalTasks } from '../services/geminiService';
import { 
  TrainFront, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  User, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Play,
  Settings,
  Download,
  AlertCircle,
  Cpu,
  Zap,
  Printer,
  Share2,
  HardHat,
  Truck,
  ShieldCheck,
  Search,
  FileCheck,
  Battery,
  Fuel,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  GripVertical,
  X,
  Calendar,
  MapPin,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface Props {
  trains: Train[];
  tasks: OperationTask[];
  setTasks: React.Dispatch<React.SetStateAction<OperationTask[]>>;
}

type ActionType = 'TASKS' | 'MANIFEST' | 'RESOURCES' | 'CUSTOMS' | null;

const OperationsView: React.FC<Props> = ({ trains, tasks, setTasks }) => {
  const [activeTab, setActiveTab] = useState<'trains' | 'tasks'>('trains');
  const [expandedTrainId, setExpandedTrainId] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [selectedTask, setSelectedTask] = useState<OperationTask | null>(null);
  
  // Interactivity States
  const [simulationMode, setSimulationMode] = useState(false);
  const [xrayRequested, setXrayRequested] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const toggleTrainDetails = (id: string) => {
    if (expandedTrainId === id) {
      setExpandedTrainId(null);
      setActiveAction(null);
    } else {
      setExpandedTrainId(id);
      setActiveAction(null);
    }
  };

  const handleActionClick = (action: ActionType) => {
    setActiveAction(prev => prev === action ? null : action);
  };

  const toggleXray = (trainId: string) => {
    setXrayRequested(prev => ({...prev, [trainId]: !prev[trainId]}));
  };

  const fallbackGenerateTasks = (train: Train) => {
    const newTasks: OperationTask[] = [
        {
            id: `tk-${Date.now()}-1`,
            type: 'UNLOAD',
            priority: 'HIGH',
            status: 'PENDING',
            assignedTo: 'RMG-01',
            targetId: train.number,
            description: `Выгрузка секции A (10 конт.) из состава ${train.number}`,
            timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})
        },
        {
            id: `tk-${Date.now()}-2`,
            type: 'MOVE',
            priority: 'NORMAL',
            status: 'PENDING',
            assignedTo: 'Ричстакер RS-03',
            targetId: 'KZT-ZONE-B',
            description: `Перемещение на досмотровую площадку`,
            timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})
        },
        {
            id: `tk-${Date.now()}-3`,
            type: 'INSPECT',
            priority: 'NORMAL',
            status: 'PENDING',
            assignedTo: 'Тальман',
            targetId: train.number,
            description: `Сверка пломб по манифесту`,
            timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})
        }
    ];

    setTasks(prev => [...newTasks, ...prev]);
    setActiveTab('tasks');
    alert('Задачи успешно сгенерированы (Шаблон).');
  };

  const handleGenerateTasks = async () => {
    setIsGenerating(true);
    
    const train = trains.find(t => t.id === expandedTrainId);
    if (!train) {
        setIsGenerating(false);
        return;
    }

    if (simulationMode) {
        try {
            const aiTasks = await generateOperationalTasks(train);
            if (aiTasks.length > 0) {
                setTasks(prev => [...aiTasks, ...prev]);
                alert(`AI успешно сгенерировал ${aiTasks.length} уникальных задач для поезда ${train.number}.`);
                setActiveTab('tasks');
            } else {
                throw new Error("Empty AI response");
            }
        } catch (error) {
            console.error("AI Generation failed, using fallback:", error);
            fallbackGenerateTasks(train);
        } finally {
            setIsGenerating(false);
        }
    } else {
        // Standard Manual Simulation (Timeout)
        setTimeout(() => {
            fallbackGenerateTasks(train);
            setIsGenerating(false);
        }, 1500);
    }
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
        setDragOverColumn(status);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedTaskId) return;

    setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === draggedTaskId) {
            return { ...task, status: newStatus as any };
        }
        return task;
    }));
    
    setDraggedTaskId(null);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Операционный Центр</h2>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm">Управление Ж/Д фронтом и задачами персонала</p>
        </div>
        <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={() => setActiveTab('trains')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'trains' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Ж/Д Планирование
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
          >
            Диспетчер Задач
          </button>
        </div>
      </div>

      {activeTab === 'trains' ? (
        <div className="grid grid-cols-1 gap-4">
          {trains.map(train => (
            <div key={train.id} className={`bg-white dark:bg-zinc-900 border rounded-xl transition-all duration-300 ${expandedTrainId === train.id ? 'border-blue-500/50 shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
               {/* Main Card Header */}
               <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                 <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-full border border-zinc-200 dark:border-zinc-800 relative">
                   <TrainFront size={32} className={train.direction === 'INBOUND' ? 'text-emerald-500 dark:text-emerald-400' : 'text-blue-500 dark:text-blue-400'} />
                   {train.status === 'PROCESSING' && (
                     <span className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-ping"></span>
                   )}
                 </div>
                 <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                   <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Номер поезда</p>
                     <p className="text-xl font-bold text-zinc-900 dark:text-white">{train.number}</p>
                     <span className={`text-[10px] px-2 py-0.5 rounded border ${train.direction === 'INBOUND' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}`}>
                       {train.direction === 'INBOUND' ? 'ПРИБЫТИЕ' : 'ОТПРАВЛЕНИЕ'}
                     </span>
                   </div>
                   <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Статус</p>
                     <p className={`font-medium ${
                       train.status === 'PROCESSING' ? 'text-amber-500 dark:text-amber-400' : 
                       train.status === 'ARRIVED' ? 'text-emerald-500 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'
                     }`}>{train.status}</p>
                     <p className="text-xs text-zinc-500 mt-1">ETA: {train.eta}</p>
                   </div>
                   <div>
                     <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Состав</p>
                     <p className="text-zinc-700 dark:text-zinc-200">{train.wagonCount} вагонов</p>
                     <p className="text-xs text-zinc-500 mt-1">{train.cargoType}</p>
                   </div>
                   <div className="flex items-center justify-end">
                     <button 
                        onClick={() => toggleTrainDetails(train.id)}
                        className={`px-4 py-2 border rounded-lg transition-all text-sm flex items-center gap-2 ${
                          expandedTrainId === train.id 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-blue-500'
                        }`}
                     >
                       {expandedTrainId === train.id ? 'Свернуть' : 'План погрузки'}
                       {expandedTrainId === train.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                     </button>
                   </div>
                 </div>
               </div>

               {/* Expanded Operations Panel */}
               {expandedTrainId === train.id && (
                 <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/30 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Visualization of Wagons */}
                        <div className="lg:col-span-2 space-y-3">
                           <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                              <span>Карта состава</span>
                              <span>Загружено: {Math.round(Math.random() * 100)}%</span>
                           </div>
                           <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto custom-scrollbar">
                              <div className="flex gap-1 min-w-max">
                                 {/* Locomotive */}
                                 <div className="w-12 h-8 bg-zinc-600 dark:bg-zinc-700 rounded-l-md flex items-center justify-center border border-zinc-500 dark:border-zinc-600">
                                   <div className="w-8 h-1 bg-zinc-400 dark:bg-zinc-500"></div>
                                 </div>
                                 {/* Wagons */}
                                 {Array.from({ length: train.wagonCount }).map((_, idx) => {
                                    const status = Math.random(); // Mock status
                                    let color = 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700';
                                    if(status > 0.7) color = 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-500/30'; // Loaded
                                    if(status < 0.2) color = 'bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-500/30'; // Issue
                                    
                                    return (
                                      <div key={idx} className={`w-8 h-8 rounded-sm border ${color} relative group cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-600 hover:border-blue-400 transition-colors`}>
                                         <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                           Вагон #{idx + 101}
                                         </span>
                                      </div>
                                    );
                                 })}
                              </div>
                           </div>
                           <div className="flex gap-4 text-[10px] text-zinc-500 font-mono mt-1">
                              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-200 dark:bg-emerald-900/50 border border-emerald-400 dark:border-emerald-500/30 rounded-sm"></div> ГОТОВ К ОТГРУЗКЕ</div>
                              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-800 border border-zinc-400 dark:border-zinc-700 rounded-sm"></div> ПУСТОЙ / ОЖИДАНИЕ</div>
                              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-200 dark:bg-amber-900/50 border border-amber-400 dark:border-amber-500/30 rounded-sm"></div> ТРЕБУЕТ ВНИМАНИЯ</div>
                           </div>
                        </div>

                        {/* Control Actions */}
                        <div className="lg:col-span-1 grid grid-cols-2 gap-3 content-start">
                           <button 
                              onClick={() => handleActionClick('TASKS')}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all group ${activeAction === 'TASKS' ? 'bg-blue-600 border-blue-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                           >
                              <Play size={20} className={`mb-2 ${activeAction === 'TASKS' ? 'text-white' : 'text-blue-500 dark:text-blue-400'}`} />
                              <span className={`text-xs font-bold text-center ${activeAction === 'TASKS' ? 'text-white' : 'text-zinc-700 dark:text-zinc-200'}`}>Генерация задач</span>
                           </button>

                           <button 
                              onClick={() => handleActionClick('MANIFEST')}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all group ${activeAction === 'MANIFEST' ? 'bg-emerald-600 border-emerald-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                           >
                              <FileText size={20} className={`mb-2 ${activeAction === 'MANIFEST' ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}`} />
                              <span className={`text-xs font-bold text-center ${activeAction === 'MANIFEST' ? 'text-white' : 'text-zinc-700 dark:text-zinc-200'}`}>Манифест</span>
                           </button>

                           <button 
                              onClick={() => handleActionClick('RESOURCES')}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all group ${activeAction === 'RESOURCES' ? 'bg-indigo-600 border-indigo-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                           >
                              <Settings size={20} className={`mb-2 ${activeAction === 'RESOURCES' ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
                              <span className={`text-xs font-bold text-center ${activeAction === 'RESOURCES' ? 'text-white' : 'text-zinc-700 dark:text-zinc-200'}`}>Ресурсы</span>
                           </button>

                           <button 
                              onClick={() => handleActionClick('CUSTOMS')}
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all group ${activeAction === 'CUSTOMS' ? 'bg-amber-600 border-amber-500' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                           >
                              <ShieldCheck size={20} className={`mb-2 ${activeAction === 'CUSTOMS' ? 'text-white' : 'text-amber-500 dark:text-amber-400'}`} />
                              <span className={`text-xs font-bold text-center ${activeAction === 'CUSTOMS' ? 'text-white' : 'text-zinc-700 dark:text-zinc-200'}`}>Таможня</span>
                           </button>
                        </div>
                    </div>

                    {/* DYNAMIC ACTION PANELS */}
                    {activeAction && (
                       <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300">
                          
                          {/* 1. Tasks Generation Panel */}
                          {activeAction === 'TASKS' && (
                             <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-blue-500/30 shadow-sm">
                                <h4 className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold mb-4">
                                   <Cpu size={18} className="text-blue-500 dark:text-blue-400"/> Параметры генерации задач
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                   <div>
                                      <label className="text-xs text-zinc-500 uppercase font-bold block mb-2">Стратегия</label>
                                      <select className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm text-zinc-800 dark:text-zinc-200 focus:border-blue-500 outline-none">
                                         <option>Smart Stacking (AI)</option>
                                         <option>FIFO (First In First Out)</option>
                                         <option>Direct Loading (Ship-to-Rail)</option>
                                      </select>
                                   </div>
                                   <div>
                                      <label className="text-xs text-zinc-500 uppercase font-bold block mb-2">Приоритет</label>
                                      <div className="flex gap-2">
                                         <button className="flex-1 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-700 dark:text-zinc-300 hover:border-red-500 hover:text-red-500">Срочный</button>
                                         <button className="flex-1 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-500 rounded text-sm text-blue-600 dark:text-blue-300">Обычный</button>
                                      </div>
                                   </div>
                                   <div className="flex flex-col justify-end gap-2">
                                      <div className="flex items-center justify-between">
                                         <span className="text-xs text-zinc-500">Режим симуляции AI</span>
                                         <button onClick={() => setSimulationMode(!simulationMode)} className="text-zinc-400 hover:text-blue-500">
                                            {simulationMode ? <ToggleRight size={24} className="text-blue-500"/> : <ToggleLeft size={24}/>}
                                         </button>
                                      </div>
                                      <button 
                                        onClick={handleGenerateTasks}
                                        disabled={isGenerating}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                      >
                                         {isGenerating ? <RefreshCw size={16} className="animate-spin"/> : <Zap size={16} fill="currentColor"/>}
                                         {isGenerating ? 'Создание...' : (simulationMode ? 'Запуск AI Генерации' : 'Создать задачи')}
                                      </button>
                                   </div>
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/10 rounded text-xs text-blue-700 dark:text-blue-200 flex items-start gap-2">
                                   <RefreshCw size={14} className="mt-0.5 flex-shrink-0"/>
                                   <span>
                                     <span className="font-bold">Прогноз:</span> {simulationMode ? 'Нейросеть проанализирует манифест и создаст оптимальный план.' : 'Алгоритм создаст задачи по шаблону.'}
                                   </span>
                                </div>
                             </div>
                          )}

                          {/* 2. Manifest Panel */}
                          {activeAction === 'MANIFEST' && (
                             <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-emerald-500/30 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                   <h4 className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold">
                                      <FileText size={18} className="text-emerald-500 dark:text-emerald-400"/> Документация рейса
                                   </h4>
                                   <div className="flex gap-2">
                                      <button className="text-xs bg-zinc-100 dark:bg-zinc-950 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 flex items-center gap-1 transition-colors">
                                         <Share2 size={12}/> EDI Отправка
                                      </button>
                                      <button className="text-xs bg-zinc-100 dark:bg-zinc-950 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 flex items-center gap-1 transition-colors">
                                         <Printer size={12}/> Печать пакета
                                      </button>
                                   </div>
                                </div>
                                <table className="w-full text-left text-sm">
                                   <thead>
                                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs">
                                         <th className="pb-2 font-medium">Тип документа</th>
                                         <th className="pb-2 font-medium">Номер</th>
                                         <th className="pb-2 font-medium">Статус</th>
                                         <th className="pb-2 font-medium text-right">Действия</th>
                                      </tr>
                                   </thead>
                                   <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                      <tr>
                                         <td className="py-3 text-zinc-800 dark:text-zinc-300">SMGS Накладная</td>
                                         <td className="py-3 text-zinc-600 dark:text-zinc-400 font-mono">RU-8821-001</td>
                                         <td className="py-3"><span className="text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold">ПОДПИСАН</span></td>
                                         <td className="py-3 text-right"><button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white"><Download size={14}/></button></td>
                                      </tr>
                                      <tr>
                                         <td className="py-3 text-zinc-800 dark:text-zinc-300">Передаточная ведомость</td>
                                         <td className="py-3 text-zinc-600 dark:text-zinc-400 font-mono">TR-2023-X</td>
                                         <td className="py-3"><span className="text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px] font-bold">ПРОВЕРКА</span></td>
                                         <td className="py-3 text-right"><button className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white"><Download size={14}/></button></td>
                                      </tr>
                                   </tbody>
                                </table>
                             </div>
                          )}

                          {/* 3. Resources Panel */}
                          {activeAction === 'RESOURCES' && (
                             <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-indigo-500/30 shadow-sm">
                                <h4 className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold mb-4">
                                   <HardHat size={18} className="text-indigo-500 dark:text-indigo-400"/> Распределение ресурсов
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div>
                                      <h5 className="text-xs text-zinc-500 uppercase font-bold mb-3">Техника (RMG/RTG)</h5>
                                      <div className="space-y-2">
                                         {['RMG-01 (Konecranes)', 'RMG-02 (Liebherr)', 'RTG-04 (Kalmar)'].map((machine, i) => (
                                            <label key={i} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded cursor-pointer hover:border-indigo-500 transition-colors">
                                               <div className="flex items-center gap-3">
                                                  <input type="checkbox" className="w-4 h-4 rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-indigo-500 focus:ring-offset-zinc-900" defaultChecked={i === 0}/>
                                                  <div>
                                                     <span className="text-sm text-zinc-700 dark:text-zinc-300 block">{machine}</span>
                                                     <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                                                        {i === 1 ? <Fuel size={10} className="text-amber-500"/> : <Battery size={10} className="text-emerald-500"/>}
                                                        <span>{i === 1 ? '45%' : '88%'}</span>
                                                     </div>
                                                  </div>
                                               </div>
                                               <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1 rounded">СВОБОДЕН</span>
                                            </label>
                                         ))}
                                      </div>
                                   </div>
                                   <div>
                                      <h5 className="text-xs text-zinc-500 uppercase font-bold mb-3">Бригады докеров</h5>
                                      <select className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm text-zinc-800 dark:text-zinc-200 focus:border-indigo-500 mb-3">
                                         <option>Бригада А (Смена 1)</option>
                                         <option>Бригада Б (Смена 1)</option>
                                      </select>
                                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/20 rounded">
                                         <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300 text-sm mb-1"><Clock size={14}/> Смена заканчивается через 4ч</div>
                                         <p className="text-xs text-zinc-500">Рекомендуется назначить доп. технику для ускорения обработки.</p>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}

                          {/* 4. Customs Panel */}
                          {activeAction === 'CUSTOMS' && (
                             <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-amber-500/30 shadow-sm">
                                <h4 className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold mb-4">
                                   <ShieldCheck size={18} className="text-amber-500 dark:text-amber-400"/> Таможенный контроль
                                </h4>
                                <div className="flex flex-col md:flex-row gap-6">
                                   <div className="flex-1 space-y-4">
                                      <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded">
                                         <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><FileCheck size={16}/></div>
                                            <div>
                                               <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Предварительное информирование</p>
                                               <p className="text-xs text-zinc-500">Принято системой АСТАНА-1</p>
                                            </div>
                                         </div>
                                         <span className="text-emerald-500 dark:text-emerald-400 font-bold text-xs">OK</span>
                                      </div>
                                      <div className={`flex items-center justify-between p-3 rounded border transition-colors ${xrayRequested[train.id] ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-500/20' : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-700'}`}>
                                         <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${xrayRequested[train.id] ? 'bg-amber-200 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'}`}><Search size={16}/></div>
                                            <div>
                                               <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Рентген контроль (ИДК)</p>
                                               <p className="text-xs text-zinc-500">{xrayRequested[train.id] ? 'Заявка отправлена' : 'Не назначен'}</p>
                                            </div>
                                         </div>
                                         <button 
                                            onClick={() => toggleXray(train.id)}
                                            className={`text-xs px-3 py-1.5 rounded transition-colors ${xrayRequested[train.id] ? 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}
                                         >
                                            {xrayRequested[train.id] ? 'Отменить' : 'Запросить'}
                                         </button>
                                      </div>
                                   </div>
                                   <div className="md:w-64 bg-amber-50 dark:bg-amber-900/10 p-4 rounded border border-amber-200 dark:border-amber-500/20 flex flex-col items-center justify-center text-center">
                                      <div className="mb-2 text-amber-500 font-bold text-lg">ЖЕЛТЫЙ КОРИДОР</div>
                                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">Требуется документарный контроль для 3 контейнеров из состава.</p>
                                      <button className="w-full py-1.5 bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500 text-white rounded text-xs font-medium transition-colors">Показать список</button>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>
                    )}

                    {/* Quick Stats Footer */}
                    <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-6 text-sm">
                       <div>
                         <span className="text-zinc-500 text-xs uppercase block">Общий вес</span>
                         <span className="text-zinc-900 dark:text-white font-mono font-bold">1,840 т</span>
                       </div>
                       <div>
                         <span className="text-zinc-500 text-xs uppercase block">TEU</span>
                         <span className="text-zinc-900 dark:text-white font-mono font-bold">84</span>
                       </div>
                       <div>
                         <span className="text-zinc-500 text-xs uppercase block">Ответственный</span>
                         <span className="text-blue-500 dark:text-blue-400">Диспетчер Смирнов</span>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {/* Task Columns */}
           {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
             <div 
               key={status} 
               className={`flex flex-col h-[600px] rounded-xl border transition-colors ${
                 dragOverColumn === status 
                   ? 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 border-2' 
                   : 'bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800'
               }`}
               onDragOver={(e) => handleDragOver(e, status)}
               onDragLeave={handleDragLeave}
               onDrop={(e) => handleDrop(e, status)}
             >
               <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-100/50 dark:bg-zinc-900/50 rounded-t-xl">
                 <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                   {status === 'PENDING' ? 'Очередь' : status === 'IN_PROGRESS' ? 'В работе' : 'Готово'}
                 </h3>
                 <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                   {tasks.filter(t => t.status === status).length}
                 </span>
               </div>
               <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                 {tasks.filter(t => t.status === status).map(task => (
                   <div 
                     key={task.id} 
                     onClick={() => setSelectedTask(task)}
                     draggable
                     onDragStart={(e) => handleDragStart(e, task.id)}
                     className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all cursor-grab active:cursor-grabbing group ${draggedTaskId === task.id ? 'opacity-50' : 'opacity-100'}`}
                   >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          task.priority === 'HIGH' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {task.priority === 'HIGH' ? 'ВЫСОКИЙ' : 'НОРМА'}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-zinc-500 font-mono">{task.timestamp}</span>
                          <GripVertical size={14} className="text-zinc-300 dark:text-zinc-600 cursor-grab group-hover:text-blue-500 transition-colors"/>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{task.description}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                         <span className="font-mono bg-zinc-50 dark:bg-zinc-950 px-1 rounded border border-zinc-200 dark:border-zinc-800">{task.targetId}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] text-blue-600 dark:text-blue-200 font-bold">
                          <User size={10} />
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{task.assignedTo}</span>
                      </div>
                   </div>
                 ))}
                 {tasks.filter(t => t.status === status).length === 0 && (
                   <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs italic pointer-events-none">
                     {dragOverColumn === status ? 'Отпустите, чтобы переместить' : 'Нет задач'}
                   </div>
                 )}
               </div>
             </div>
           ))}
        </div>
      )}

      {/* --- TASK DETAILS MODAL --- */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <ClipboardList size={20}/>
                 </div>
                 <div>
                   <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Детали задачи</h3>
                   <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{selectedTask.id}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedTask(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><X size={24}/></button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              
              <div className="flex items-start justify-between">
                 <div className="space-y-1">
                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedTask.description}</h4>
                    <div className="flex gap-2">
                       <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                          selectedTask.priority === 'HIGH' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                       }`}>
                          {selectedTask.priority === 'HIGH' ? 'ВЫСОКИЙ ПРИОРИТЕТ' : 'НОРМАЛЬНЫЙ ПРИОРИТЕТ'}
                       </span>
                       <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                          selectedTask.status === 'COMPLETED' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                          selectedTask.status === 'IN_PROGRESS' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                          'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
                       }`}>
                          {selectedTask.status === 'PENDING' ? 'В ОЧЕРЕДИ' : selectedTask.status === 'IN_PROGRESS' ? 'В РАБОТЕ' : 'ЗАВЕРШЕНО'}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold mb-1">
                       <User size={12}/> Исполнитель
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium">{selectedTask.assignedTo}</p>
                 </div>
                 <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold mb-1">
                       <MapPin size={12}/> Объект / Цель
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium font-mono">{selectedTask.targetId}</p>
                 </div>
                 <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold mb-1">
                       <Activity size={12}/> Тип операции
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium">{selectedTask.type}</p>
                 </div>
                 <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs uppercase font-bold mb-1">
                       <Calendar size={12}/> Время создания
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200 font-medium font-mono">{selectedTask.timestamp}</p>
                 </div>
              </div>

              {selectedTask.priority === 'HIGH' && (
                 <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 rounded-lg">
                    <AlertTriangle size={18} className="text-red-500 mt-0.5"/>
                    <div className="text-sm text-red-800 dark:text-red-200">
                       <span className="font-bold block">Внимание!</span>
                       Задача требует немедленного исполнения. Задержка может повлиять на простой Ж/Д состава.
                    </div>
                 </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
               <button onClick={() => setSelectedTask(null)} className="px-4 py-2 rounded text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                  Закрыть
               </button>
               {selectedTask.status !== 'COMPLETED' && (
                  <button onClick={() => { alert('Задача отмечена выполненной'); setSelectedTask(null); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium transition-colors shadow-sm">
                     Завершить задачу
                  </button>
               )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsView;
