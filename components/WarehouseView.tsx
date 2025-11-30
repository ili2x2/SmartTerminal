import React from 'react';
import { WarehouseItem } from '../types';
import { Package, Search, Archive, Layers } from 'lucide-react';

interface Props {
  inventory: WarehouseItem[];
}

const WarehouseView: React.FC<Props> = ({ inventory }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">WMS: Управление Складом</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Инвентаризация и управление LCL грузами</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 flex items-center gap-2">
             <Archive size={16} /> Приход
           </button>
           <button className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700">
             Инвентаризация
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Stats */}
         <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg"><Layers size={20}/></div>
                 <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Заполненность</span>
               </div>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">65%</p>
               <div className="w-full bg-slate-100 dark:bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                 <div className="bg-indigo-500 h-full w-[65%]"></div>
               </div>
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
               <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg"><Package size={20}/></div>
                 <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Всего позиций</span>
               </div>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">1,240</p>
            </div>
         </div>

         {/* Inventory List */}
         <div className="lg:col-span-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center gap-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Товарные запасы</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={14} />
                <input 
                  type="text" 
                  placeholder="Поиск SKU..." 
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200 w-64 placeholder-slate-400"
                />
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">SKU</th>
                  <th className="px-6 py-3 font-medium">Наименование</th>
                  <th className="px-6 py-3 font-medium">Категория</th>
                  <th className="px-6 py-3 font-medium">Кол-во</th>
                  <th className="px-6 py-3 font-medium">Локация</th>
                  <th className="px-6 py-3 font-medium text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">{item.sku}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{item.quantity} {item.unit}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.location}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-xs font-medium">Переместить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default WarehouseView;