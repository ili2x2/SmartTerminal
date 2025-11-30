import React, { useState, useEffect, useRef } from 'react';
import { Container, ContainerType, ContainerStatus } from '../types';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  ArrowRightLeft, 
  History, 
  Lock, 
  Edit, 
  Eye,
  FileText,
  X,
  Save,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Truck,
  RotateCcw
} from 'lucide-react';

interface Props {
  containers: Container[];
}

const statusMap: Record<string, string> = {
  [ContainerStatus.IN_YARD]: 'НА СКЛАДЕ',
  [ContainerStatus.ON_VESSEL]: 'НА СУДНЕ',
  [ContainerStatus.GATE_IN]: 'ВЪЕЗД',
  [ContainerStatus.GATE_OUT]: 'ВЫЕЗД',
  [ContainerStatus.MAINTENANCE]: 'РЕМОНТ / БЛОК',
  [ContainerStatus.ON_TRAIN]: 'НА Ж/Д',
  [ContainerStatus.WAREHOUSE]: 'СВХ'
};

const ContainerList: React.FC<Props> = ({ containers: initialContainers }) => {
  // Initialize state from localStorage or props
  const [containers, setContainers] = useState<Container[]>(() => {
    const saved = localStorage.getItem('smart_terminal_containers');
    return saved ? JSON.parse(saved) : initialContainers;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  
  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem('smart_terminal_containers', JSON.stringify(containers));
  }, [containers]);
  
  // Menu State
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal State
  const [activeModal, setActiveModal] = useState<'VIEW' | 'MOVE' | 'EDIT' | 'HISTORY' | 'BLOCK' | null>(null);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetData = () => {
    if (window.confirm('Вы уверены? Это сбросит все локальные изменения и вернет стандартные данные.')) {
        setContainers(initialContainers);
        localStorage.removeItem('smart_terminal_containers');
    }
  };

  const filteredContainers = containers.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.contentCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || c.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getContainerById = (id: string) => containers.find(c => c.id === id);

  const handleAction = (action: 'VIEW' | 'MOVE' | 'EDIT' | 'HISTORY' | 'BLOCK', containerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setSelectedContainerId(containerId);
    setActiveModal(action);
    setFormErrors({});

    // Initialize form data for Edit/Move
    const container = containers.find(c => c.id === containerId);
    if (container) {
      if (action === 'MOVE') {
        setFormData({ zone: container.location.zone, row: container.location.row, tier: container.location.tier });
      } else if (action === 'EDIT') {
        setFormData({ weight: container.weight, owner: container.owner, content: container.contentCategory });
      } else if (action === 'BLOCK') {
        setFormData({ reason: 'Таможенный досмотр', notes: '' });
      }
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedContainerId(null);
    setFormErrors({});
  };

  // --- Action Handlers ---

  const validateMove = () => {
      const errors: Record<string, string> = {};
      if (!formData.row || formData.row.length < 2) errors.row = "Неверный формат ряда (Например: 01)";
      if (!formData.tier || formData.tier < 1 || formData.tier > 5) errors.tier = "Ярус должен быть от 1 до 5";
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const saveMove = () => {
    if (!selectedContainerId || !validateMove()) return;
    setContainers(prev => prev.map(c => {
      if (c.id === selectedContainerId) {
        return {
          ...c,
          location: {
            zone: formData.zone,
            row: formData.row,
            tier: Number(formData.tier)
          }
        };
      }
      return c;
    }));
    closeModal();
  };

  const validateEdit = () => {
      const errors: Record<string, string> = {};
      if (!formData.owner) errors.owner = "Владелец обязателен";
      if (!formData.weight || formData.weight <= 0) errors.weight = "Вес должен быть больше 0";
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const saveEdit = () => {
    if (!selectedContainerId || !validateEdit()) return;
    setContainers(prev => prev.map(c => {
      if (c.id === selectedContainerId) {
        return {
          ...c,
          weight: Number(formData.weight),
          owner: formData.owner,
          contentCategory: formData.content
        };
      }
      return c;
    }));
    closeModal();
  };

  const confirmBlock = () => {
    if (!selectedContainerId) return;
    setContainers(prev => prev.map(c => {
      if (c.id === selectedContainerId) {
        return {
          ...c,
          status: ContainerStatus.MAINTENANCE, // Using MAINTENANCE as Block status for visual
        };
      }
      return c;
    }));
    closeModal();
  };

  // --- Mock History Generator ---
  const getMockHistory = (container: Container) => {
    const arrival = new Date(container.arrivalDate);
    return [
      { date: new Date().toLocaleString('ru-RU'), event: 'Проверка ярлыка', user: 'Система', icon: <CheckCircle2 size={16}/> },
      { date: new Date(arrival.getTime() + 7200000).toLocaleString('ru-RU'), event: `Размещение в зоне ${container.location.zone}`, user: 'Кран RTG-01', icon: <ArrowRightLeft size={16}/> },
      { date: new Date(arrival.getTime() + 3600000).toLocaleString('ru-RU'), event: 'Въезд через КПП-1', user: 'Инспектор А.', icon: <Truck size={16}/> },
      { date: arrival.toLocaleString('ru-RU'), event: 'Регистрация заявки', user: 'Портал', icon: <FileText size={16}/> },
    ];
  };

  const selectedContainer = selectedContainerId ? getContainerById(selectedContainerId) : null;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Реестр контейнеров</h2>
            <button onClick={resetData} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Сбросить изменения">
                <RotateCcw size={16} />
            </button>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Поиск по ID, Владельцу..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 min-w-[200px] transition-all text-slate-900 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
          
          <div className="relative">
             <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer text-slate-700 dark:text-slate-300"
             >
               <option value="ALL">Все типы</option>
               {Object.values(ContainerType).map(t => <option key={t} value={t}>{t}</option>)}
             </select>
             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <Download size={16} />
            Экспорт
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm min-h-[400px]">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                <th className="px-6 py-4">ID Контейнера</th>
                <th className="px-6 py-4">Тип</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Локация</th>
                <th className="px-6 py-4">Владелец</th>
                <th className="px-6 py-4">Груз</th>
                <th className="px-6 py-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredContainers.length > 0 ? filteredContainers.map(container => (
                <tr key={container.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group relative">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{container.code}</span>
                      <span className="text-xs text-slate-500">{container.size}ft • {container.weight.toLocaleString()}kg</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      container.type === ContainerType.REEFER ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 
                      container.type === ContainerType.TANK ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : 
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}>
                      {container.type}
                      {container.type === ContainerType.REEFER && container.temperature && (
                        <span className="ml-1 border-l border-emerald-300 dark:border-emerald-500/30 pl-1">{container.temperature}°C</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${
                          container.status === ContainerStatus.IN_YARD ? 'bg-blue-500' :
                          container.status === ContainerStatus.MAINTENANCE ? 'bg-red-500 animate-pulse' : 'bg-slate-500'
                       }`}></span>
                       <span className={`text-sm ${container.status === ContainerStatus.MAINTENANCE ? 'text-red-500 dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                         {statusMap[container.status] || container.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
                      {container.location.zone}-{container.location.row}-{container.location.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    {container.owner}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {container.contentCategory}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => toggleMenu(container.id, e)}
                      className={`p-1.5 rounded transition-colors ${activeMenuId === container.id ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === container.id && (
                      <div ref={menuRef} className="absolute right-8 top-8 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="py-1">
                          <button 
                             onClick={(e) => handleAction('VIEW', container.id, e)}
                             className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                          >
                            <Eye size={14} /> Карточка
                          </button>
                          <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
                          <button 
                             onClick={(e) => handleAction('MOVE', container.id, e)}
                             className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-2"
                          >
                            <ArrowRightLeft size={14} /> Переместить
                          </button>
                          <button 
                             onClick={(e) => handleAction('EDIT', container.id, e)}
                             className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                          >
                            <Edit size={14} /> Редактировать
                          </button>
                          <button 
                             onClick={(e) => handleAction('HISTORY', container.id, e)}
                             className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                          >
                            <History size={14} /> История
                          </button>
                          <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
                          <button 
                             onClick={(e) => handleAction('BLOCK', container.id, e)}
                             className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-2"
                          >
                            <Lock size={14} /> Блокировать
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Контейнеры не найдены.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
           <span>Показано {filteredContainers.length} из {containers.length} записей</span>
           <div className="flex gap-1">
             <button className="px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Пред.</button>
             <button className="px-3 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800">След.</button>
           </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {activeModal && selectedContainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg text-blue-600 dark:text-blue-400">
                      {activeModal === 'VIEW' && <Eye size={20}/>}
                      {activeModal === 'MOVE' && <ArrowRightLeft size={20}/>}
                      {activeModal === 'EDIT' && <Edit size={20}/>}
                      {activeModal === 'HISTORY' && <History size={20}/>}
                      {activeModal === 'BLOCK' && <AlertTriangle size={20} className="text-red-500 dark:text-red-400"/>}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {activeModal === 'VIEW' && 'Карточка контейнера'}
                        {activeModal === 'MOVE' && 'Перемещение'}
                        {activeModal === 'EDIT' && 'Редактирование данных'}
                        {activeModal === 'HISTORY' && 'История событий'}
                        {activeModal === 'BLOCK' && 'Блокировка / Удержание'}
                     </h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{selectedContainer.code}</p>
                   </div>
                </div>
                <button onClick={closeModal} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={24}/></button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                 
                 {/* 1. VIEW MODAL */}
                 {activeModal === 'VIEW' && (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                             <p className="text-xs text-slate-500 uppercase">Владелец</p>
                             <p className="font-medium text-slate-900 dark:text-white">{selectedContainer.owner}</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                             <p className="text-xs text-slate-500 uppercase">Тип / Размер</p>
                             <p className="font-medium text-slate-900 dark:text-white">{selectedContainer.type} {selectedContainer.size}'</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                             <p className="text-xs text-slate-500 uppercase">Вес (Брутто)</p>
                             <p className="font-medium text-slate-900 dark:text-white">{selectedContainer.weight.toLocaleString()} кг</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                             <p className="text-xs text-slate-500 uppercase">Категория груза</p>
                             <p className="font-medium text-slate-900 dark:text-white">{selectedContainer.contentCategory}</p>
                          </div>
                       </div>
                       
                       <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-4">
                          <div className="flex items-center gap-2 mb-2">
                             <MapPin size={16} className="text-blue-500"/>
                             <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Текущая локация</span>
                          </div>
                          <div className="flex gap-2">
                             <div className="flex-1 text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 p-2 rounded">
                                <span className="block text-xs text-blue-600 dark:text-blue-300">Зона</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white text-lg">{selectedContainer.location.zone}</span>
                             </div>
                             <div className="flex-1 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded">
                                <span className="block text-xs text-slate-500">Ряд</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white text-lg">{selectedContainer.location.row}</span>
                             </div>
                             <div className="flex-1 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded">
                                <span className="block text-xs text-slate-500">Ярус</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white text-lg">{selectedContainer.location.tier}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                          <Calendar size={14}/> Дата прибытия: {new Date(selectedContainer.arrivalDate).toLocaleString('ru-RU')}
                       </div>
                    </div>
                 )}

                 {/* 2. MOVE MODAL */}
                 {activeModal === 'MOVE' && (
                    <div className="space-y-4">
                       <p className="text-sm text-slate-600 dark:text-slate-400">Выберите новую позицию для перемещения контейнера. Система создаст задачу для крана.</p>
                       
                       <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Целевая зона</label>
                          <div className="grid grid-cols-4 gap-2">
                             {['A', 'B', 'C', 'D'].map(zone => (
                                <button 
                                   key={zone}
                                   onClick={() => setFormData({...formData, zone})}
                                   className={`py-2 rounded border font-bold transition-all ${
                                      formData.zone === zone 
                                      ? 'bg-blue-600 border-blue-500 text-white' 
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                                   }`}
                                >
                                   {zone}
                                </button>
                             ))}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Ряд (01-99)</label>
                             <input 
                               type="text" 
                               value={formData.row} 
                               onChange={(e) => setFormData({...formData, row: e.target.value})}
                               className={`w-full bg-white dark:bg-slate-900 border rounded p-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none font-mono ${formErrors.row ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                               placeholder="01"
                             />
                             {formErrors.row && <p className="text-xs text-red-500 mt-1">{formErrors.row}</p>}
                          </div>
                          <div>
                             <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Ярус (1-5)</label>
                             <input 
                               type="number" 
                               max={5} min={1}
                               value={formData.tier} 
                               onChange={(e) => setFormData({...formData, tier: e.target.value})}
                               className={`w-full bg-white dark:bg-slate-900 border rounded p-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none font-mono ${formErrors.tier ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                             />
                             {formErrors.tier && <p className="text-xs text-red-500 mt-1">{formErrors.tier}</p>}
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 3. EDIT MODAL */}
                 {activeModal === 'EDIT' && (
                    <div className="space-y-4">
                       <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Владелец (Линия)</label>
                          <input 
                             type="text" 
                             value={formData.owner}
                             onChange={(e) => setFormData({...formData, owner: e.target.value})}
                             className={`w-full bg-white dark:bg-slate-900 border rounded p-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none ${formErrors.owner ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                          />
                          {formErrors.owner && <p className="text-xs text-red-500 mt-1">{formErrors.owner}</p>}
                       </div>
                       <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Категория груза</label>
                          <input 
                             type="text" 
                             value={formData.content}
                             onChange={(e) => setFormData({...formData, content: e.target.value})}
                             className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none"
                          />
                       </div>
                       <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Вес (кг)</label>
                          <input 
                             type="number" 
                             value={formData.weight}
                             onChange={(e) => setFormData({...formData, weight: e.target.value})}
                             className={`w-full bg-white dark:bg-slate-900 border rounded p-2 text-slate-900 dark:text-white focus:border-blue-500 outline-none ${formErrors.weight ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                          />
                          {formErrors.weight && <p className="text-xs text-red-500 mt-1">{formErrors.weight}</p>}
                       </div>
                    </div>
                 )}

                 {/* 4. HISTORY MODAL */}
                 {activeModal === 'HISTORY' && (
                    <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6">
                       {getMockHistory(selectedContainer).map((item, idx) => (
                          <div key={idx} className="relative pl-6">
                             <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                                {item.icon}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.event}</p>
                                <div className="flex justify-between items-center mt-1">
                                   <span className="text-xs text-slate-500">{item.date}</span>
                                   <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/10 px-1.5 rounded">{item.user}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}

                 {/* 5. BLOCK MODAL */}
                 {activeModal === 'BLOCK' && (
                    <div className="space-y-4">
                       <div className="p-4 bg-red-100 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-lg flex gap-3">
                          <AlertTriangle className="text-red-600 dark:text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-800 dark:text-red-200">
                             Блокировка запретит любые перемещения контейнера (Gate Out / Погрузка) до снятия статуса.
                          </p>
                       </div>
                       
                       <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Причина удержания</label>
                          <div className="space-y-2">
                             {['Таможенный досмотр', 'Повреждение / Ремонт', 'Задолженность клиента', 'Санитарный контроль'].map(reason => (
                                <label key={reason} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-red-500/50">
                                   <input 
                                      type="radio" 
                                      name="blockReason"
                                      checked={formData.reason === reason}
                                      onChange={() => setFormData({...formData, reason})}
                                      className="text-red-500 focus:ring-red-500 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700"
                                   />
                                   <span className="text-sm text-slate-700 dark:text-slate-300">{reason}</span>
                                </label>
                             ))}
                          </div>
                       </div>
                       
                       <div>
                          <label className="text-xs text-slate-500 font-bold uppercase mb-1 block">Примечание</label>
                          <textarea 
                             value={formData.notes || ''}
                             onChange={(e) => setFormData({...formData, notes: e.target.value})}
                             placeholder="Введите дополнительную информацию..."
                             className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white focus:border-red-500 outline-none text-sm h-20 resize-none"
                          />
                       </div>
                    </div>
                 )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                 <button 
                    onClick={closeModal}
                    className="px-4 py-2 rounded text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                 >
                    Отмена
                 </button>
                 
                 {activeModal === 'MOVE' && (
                    <button onClick={saveMove} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
                       <Save size={16}/> Сохранить перемещение
                    </button>
                 )}
                 {activeModal === 'EDIT' && (
                    <button onClick={saveEdit} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
                       <Save size={16}/> Обновить данные
                    </button>
                 )}
                 {activeModal === 'BLOCK' && (
                    <button onClick={confirmBlock} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-medium flex items-center gap-2">
                       <Lock size={16}/> Подтвердить блок
                    </button>
                 )}
                 {(activeModal === 'VIEW' || activeModal === 'HISTORY') && (
                    <button onClick={closeModal} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded text-sm font-medium">
                       Закрыть
                    </button>
                 )}
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default ContainerList;