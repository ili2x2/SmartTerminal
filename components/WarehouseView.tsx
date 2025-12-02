
import React, { useState } from 'react';
import { WarehouseItem } from '../types';
import { Package, Search, Archive, Layers, X, Save, CheckCircle2 } from 'lucide-react';

interface Props {
  inventory: WarehouseItem[];
  setInventory: React.Dispatch<React.SetStateAction<WarehouseItem[]>>;
}

const WarehouseView: React.FC<Props> = ({ inventory, setInventory }) => {
  const [activeModal, setActiveModal] = useState<'ARRIVAL' | 'INVENTORY' | null>(null);
  const [formData, setFormData] = useState({
      sku: '',
      name: '',
      category: '',
      quantity: 0,
      unit: 'шт',
      location: ''
  });

  const handleOpenArrival = () => {
    setFormData({ sku: '', name: '', category: '', quantity: 0, unit: 'шт', location: '' });
    setActiveModal('ARRIVAL');
  };

  const handleSaveArrival = () => {
    const newItem: WarehouseItem = {
        id: `w-${Date.now()}`,
        sku: formData.sku || `SKU-${Math.floor(Math.random()*1000)}`,
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        location: formData.location
    };
    setInventory(prev => [...prev, newItem]);
    setActiveModal(null);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">WMS: Управление Складом</h2>
           <p className="text-zinc-500 dark:text-zinc-400 text-sm">Инвентаризация и управление LCL грузами</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={handleOpenArrival}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 flex items-center gap-2 transition-colors"
           >
             <Archive size={16} /> Приход
           </button>
           <button 
             onClick={() => setActiveModal('INVENTORY')}
             className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 transition-colors"
           >
             Инвентаризация
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Stats */}
         <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg"><Layers size={20}/></div>
                 <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Заполненность</span>
               </div>
               <p className="text-2xl font-bold text-zinc-900 dark:text-white">65%</p>
               <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full mt-2 overflow-hidden">
                 <div className="bg-indigo-500 h-full w-[65%]"></div>
               </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg"><Package size={20}/></div>
                 <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Всего позиций</span>
               </div>
               <p className="text-2xl font-bold text-zinc-900 dark:text-white">{inventory.length}</p>
            </div>
         </div>

         {/* Inventory List */}
         <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center gap-4">
              <h3 className="font-semibold text-zinc-900 dark:text-white">Товарные запасы</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={14} />
                <input 
                  type="text" 
                  placeholder="Поиск SKU..." 
                  className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-zinc-800 dark:text-zinc-200 w-64 placeholder-zinc-400"
                />
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Наименование</th>
                  <th className="px-6 py-3 font-medium">Категория</th>
                  <th className="px-6 py-3 font-medium">Кол-во</th>
                  <th className="px-6 py-3 font-medium">Локация</th>
                  <th className="px-6 py-3 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-500 dark:text-zinc-400">{item.sku}</td>
                    <td className="px-6 py-4 font-medium text-zinc-800 dark:text-zinc-200">{item.name}</td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-xs border border-zinc-200 dark:border-zinc-700">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{item.location}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-xs font-medium">Переместить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>

      {/* --- MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             
             {/* Header */}
             <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg text-blue-600 dark:text-blue-400">
                   {activeModal === 'ARRIVAL' ? <Archive size={20}/> : <CheckCircle2 size={20}/>}
                 </div>
                 <h3 className="font-bold text-zinc-900 dark:text-white text-lg">
                   {activeModal === 'ARRIVAL' ? 'Оформление прихода' : 'Текущая инвентаризация'}
                 </h3>
               </div>
               <button onClick={() => setActiveModal(null)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"><X size={24}/></button>
             </div>

             {/* Content */}
             <div className="p-6">
               
               {activeModal === 'ARRIVAL' && (
                  <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Артикул (SKU)</label>
                           <input 
                              type="text"
                              value={formData.sku}
                              onChange={e => setFormData({...formData, sku: e.target.value})}
                              placeholder="AUTO-GEN"
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Категория</label>
                           <input 
                              type="text"
                              value={formData.category}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Наименование груза</label>
                        <input 
                           type="text"
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                           className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
                        />
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Кол-во</label>
                           <input 
                              type="number"
                              value={formData.quantity}
                              onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
                           />
                        </div>
                        <div className="col-span-1">
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Ед. изм.</label>
                           <select 
                              value={formData.unit}
                              onChange={e => setFormData({...formData, unit: e.target.value})}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
                           >
                              <option>шт</option>
                              <option>кг</option>
                              <option>тонн</option>
                              <option>паллет</option>
                           </select>
                        </div>
                         <div className="col-span-1">
                           <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Ячейка</label>
                           <input 
                              type="text"
                              value={formData.location}
                              onChange={e => setFormData({...formData, location: e.target.value})}
                              placeholder="W1-A-01"
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm text-zinc-900 dark:text-white focus:border-blue-500 outline-none"
                           />
                        </div>
                     </div>
                  </div>
               )}

               {activeModal === 'INVENTORY' && (
                  <div className="space-y-4">
                     <p className="text-sm text-zinc-600 dark:text-zinc-400">Выберите товары для подтверждения фактического наличия. Результаты будут сохранены в журнале аудита.</p>
                     <div className="max-h-60 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
                        {inventory.map(item => (
                           <label key={item.id} className="flex items-center gap-3 p-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-zinc-300" />
                              <div className="flex-1">
                                 <div className="flex justify-between">
                                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{item.sku}</span>
                                    <span className="font-mono text-xs text-zinc-500">{item.location}</span>
                                 </div>
                                 <p className="text-xs text-zinc-500">{item.name}</p>
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>
               )}

             </div>

             {/* Footer */}
             <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                 <button 
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                 >
                    Отмена
                 </button>
                 {activeModal === 'ARRIVAL' && (
                    <button onClick={handleSaveArrival} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
                       <Save size={16}/> Сохранить
                    </button>
                 )}
                 {activeModal === 'INVENTORY' && (
                    <button onClick={() => { alert('Инвентаризация завершена успешно.'); setActiveModal(null); }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium flex items-center gap-2">
                       <CheckCircle2 size={16}/> Завершить проверку
                    </button>
                 )}
             </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseView;
