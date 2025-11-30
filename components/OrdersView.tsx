import React, { useState } from 'react';
import { ClientOrder } from '../types';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Plus, 
  Download, 
  Eye, 
  X, 
  Upload, 
  CreditCard, 
  MapPin, 
  Calendar,
  Package,
  ArrowRight,
  Printer
} from 'lucide-react';

interface Props {
  orders: ClientOrder[];
}

// Mock extra data for the demo
const getOrderDetails = (id: string) => ({
  route: { from: 'Сиань (CN)', to: 'Алматы (KZ)', transport: 'Ж/Д + Авто' },
  financials: { total: '$12,450.00', paid: '$3,500.00', status: 'PARTIAL' },
  cargo: [
    { name: 'Электроника (ТН ВЭД 8504)', qty: '450 коробок', weight: '4.5 т' },
    { name: 'Аксессуары', qty: '120 коробок', weight: '1.2 т' }
  ],
  timeline: [
    { step: 'Создание заявки', date: '01.11.2023', completed: true },
    { step: 'Проверка менеджером', date: '01.11.2023', completed: true },
    { step: 'Подписание договора', date: '02.11.2023', completed: true },
    { step: 'Оплата счета', date: 'In Progress', completed: false },
    { step: 'Исполнение', date: 'Pending', completed: false },
  ]
});

const getOrderDocs = (id: string) => [
  { name: `Договор №${id.toUpperCase()}-23`, type: 'PDF', size: '2.4 MB', status: 'SIGNED', date: '01.11.2023' },
  { name: 'Инвойс (Proforma)', type: 'PDF', size: '1.1 MB', status: 'APPROVED', date: '01.11.2023' },
  { name: 'Упаковочный лист', type: 'XLSX', size: '450 KB', status: 'PENDING', date: '-' },
  { name: 'Таможенная декларация', type: 'XML', size: '12 KB', status: 'MISSING', date: '-' },
];

const OrdersView: React.FC<Props> = ({ orders }) => {
  const [activeModal, setActiveModal] = useState<'DOCS' | 'DETAILS' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ClientOrder | null>(null);

  const handleOpen = (type: 'DOCS' | 'DETAILS', order: ClientOrder) => {
    setSelectedOrder(order);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Коммерческий отдел</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm">Управление заявками и контрактами клиентов</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20 transition-transform active:scale-95">
          <Plus size={16} /> Новая заявка
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg flex flex-col shadow-sm">
             <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                 <FileText size={20} className="text-slate-600 dark:text-slate-300" />
               </div>
               <span className={`px-2 py-1 rounded text-xs font-bold border ${
                 order.status === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                 order.status === 'SUBMITTED' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                 order.status === 'COMPLETED' ? 'bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600/20' :
                 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
               }`}>
                 {order.status}
               </span>
             </div>
             
             <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">{order.clientName}</h3>
                <p className="text-xs text-slate-500 mb-4 font-mono flex items-center gap-2">
                   <span>ID: {order.id.toUpperCase()}</span>
                   <span className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></span>
                   <span>{order.date}</span>
                </p>
                
                <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Тип операции</span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{order.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Объем</span>
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{order.volume}</span>
                  </div>
                </div>
             </div>

             <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => handleOpen('DOCS', order)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText size={14}/> Документы
                </button>
                <button 
                  onClick={() => handleOpen('DETAILS', order)}
                  className="flex-1 py-2 bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-600/30 hover:bg-blue-100 dark:hover:bg-blue-600/20 hover:border-blue-300 dark:hover:border-blue-500/50 rounded text-xs text-blue-600 dark:text-blue-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={14}/> Подробнее
                </button>
             </div>
          </div>
        ))}
        
        {/* "Add New" visual placeholder */}
        <button className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/5 transition-all min-h-[250px] group">
           <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full mb-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
              <Plus size={32} className="opacity-50 group-hover:opacity-100" />
           </div>
           <span className="text-sm font-medium">Создать черновик</span>
           <span className="text-xs text-slate-500 dark:text-slate-600 mt-1">Новый клиент или контракт</span>
        </button>
      </div>

      {/* --- MODALS --- */}
      {activeModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className={`bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 w-full ${activeModal === 'DETAILS' ? 'max-w-4xl' : 'max-w-2xl'}`}>
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 dark:bg-blue-600/20 rounded-lg text-blue-600 dark:text-blue-400">
                      {activeModal === 'DOCS' ? <FileText size={20}/> : <Eye size={20}/>}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {activeModal === 'DOCS' ? 'Пакет документов' : 'Карточка заявки'}
                     </h3>
                     <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {selectedOrder.clientName} • #{selectedOrder.id.toUpperCase()}
                     </p>
                   </div>
                </div>
                <button onClick={closeModal} className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={24}/></button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                 
                 {/* 1. DOCUMENTS MODAL */}
                 {activeModal === 'DOCS' && (
                    <div className="space-y-6">
                       <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-lg">
                          <div>
                             <p className="text-sm font-bold text-slate-800 dark:text-white">Статус пакета: Неполный</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Необходимо загрузить таможенную декларацию.</p>
                          </div>
                          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded flex items-center gap-2">
                             <Upload size={14}/> Загрузить
                          </button>
                       </div>

                       <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                          <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500">
                                <tr>
                                   <th className="px-4 py-3 font-medium">Документ</th>
                                   <th className="px-4 py-3 font-medium">Тип</th>
                                   <th className="px-4 py-3 font-medium">Статус</th>
                                   <th className="px-4 py-3 font-medium text-right">Действия</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {getOrderDocs(selectedOrder.id).map((doc, idx) => (
                                   <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                      <td className="px-4 py-3">
                                         <div className="flex flex-col">
                                            <span className="text-slate-800 dark:text-slate-200 font-medium">{doc.name}</span>
                                            <span className="text-[10px] text-slate-500">{doc.date} • {doc.size}</span>
                                         </div>
                                      </td>
                                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{doc.type}</td>
                                      <td className="px-4 py-3">
                                         <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                            doc.status === 'SIGNED' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                            doc.status === 'APPROVED' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                                            doc.status === 'MISSING' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                         }`}>
                                            {doc.status}
                                         </span>
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                         {doc.status !== 'MISSING' && (
                                            <button className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-1">
                                               <Download size={16}/>
                                            </button>
                                         )}
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 )}

                 {/* 2. DETAILS MODAL */}
                 {activeModal === 'DETAILS' && (
                    <div className="space-y-8">
                       {/* Stepper */}
                       <div className="relative">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
                          <div className="relative z-10 flex justify-between">
                             {getOrderDetails(selectedOrder.id).timeline.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                      step.completed ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-600'
                                   }`}>
                                      {step.completed ? <CheckCircle size={14}/> : <span className="text-xs font-mono">{idx + 1}</span>}
                                   </div>
                                   <div className="text-center">
                                      <p className={`text-xs font-bold ${step.completed ? 'text-blue-600 dark:text-blue-300' : 'text-slate-500'}`}>{step.step}</p>
                                      <p className="text-[10px] text-slate-500 dark:text-slate-600">{step.date}</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>

                       {/* Main Info Grid */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Left Column: Route & Cargo */}
                          <div className="space-y-6">
                             <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
                                   <MapPin size={16} className="text-emerald-500 dark:text-emerald-400"/> Маршрут и Логистика
                                </h4>
                                <div className="flex items-center justify-between gap-4 mb-4">
                                   <div className="bg-white dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 flex-1 text-center">
                                      <span className="text-xs text-slate-500 block">Отправление</span>
                                      <span className="font-bold text-slate-800 dark:text-slate-200">{getOrderDetails(selectedOrder.id).route.from}</span>
                                   </div>
                                   <ArrowRight size={16} className="text-slate-400 dark:text-slate-600" />
                                   <div className="bg-white dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 flex-1 text-center">
                                      <span className="text-xs text-slate-500 block">Назначение</span>
                                      <span className="font-bold text-slate-800 dark:text-slate-200">{getOrderDetails(selectedOrder.id).route.to}</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                   <span className="font-bold text-slate-700 dark:text-slate-300">Транспорт:</span> {getOrderDetails(selectedOrder.id).route.transport}
                                </div>
                             </div>

                             <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
                                   <Package size={16} className="text-blue-500 dark:text-blue-400"/> Спецификация груза
                                </h4>
                                <div className="space-y-3">
                                   {getOrderDetails(selectedOrder.id).cargo.map((item, i) => (
                                      <div key={i} className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-800 pb-2 last:border-0">
                                         <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                                         <div className="text-right">
                                            <span className="block text-slate-800 dark:text-slate-200 font-mono">{item.qty}</span>
                                            <span className="block text-[10px] text-slate-500">{item.weight}</span>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          </div>

                          {/* Right Column: Finance */}
                          <div className="space-y-6">
                             <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
                                   <CreditCard size={16} className="text-amber-500 dark:text-amber-400"/> Финансы
                                </h4>
                                <div className="space-y-4">
                                   <div className="flex justify-between items-center">
                                      <span className="text-sm text-slate-500 dark:text-slate-400">Общая стоимость</span>
                                      <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">{getOrderDetails(selectedOrder.id).financials.total}</span>
                                   </div>
                                   <div className="flex justify-between items-center">
                                      <span className="text-sm text-slate-500 dark:text-slate-400">Оплачено</span>
                                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{getOrderDetails(selectedOrder.id).financials.paid}</span>
                                   </div>
                                   <div className="w-full bg-white dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                                      <div className="bg-emerald-500 h-full w-[30%]"></div>
                                   </div>
                                   <div className="pt-2">
                                      <button className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 text-xs transition-colors">
                                         Выставить счет на доплату
                                      </button>
                                   </div>
                                </div>
                             </div>

                             <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-4">
                                   <Clock size={16} className="text-purple-500 dark:text-purple-400"/> SLA и Сроки
                                </h4>
                                <div className="flex items-start gap-3">
                                   <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-center flex-1">
                                      <p className="text-xs text-slate-500">Плановое прибытие</p>
                                      <p className="font-bold text-slate-800 dark:text-slate-200">14.11.2023</p>
                                   </div>
                                   <div className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-center flex-1">
                                      <p className="text-xs text-slate-500">Свободное время</p>
                                      <p className="font-bold text-emerald-600 dark:text-emerald-400">14 дней</p>
                                   </div>
                                </div>
                             </div>
                          </div>

                       </div>
                    </div>
                 )}

              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                 <button 
                    onClick={closeModal}
                    className="px-4 py-2 rounded text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                 >
                    Закрыть
                 </button>
                 {activeModal === 'DOCS' && (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium flex items-center gap-2">
                       <Printer size={16}/> Печать всех
                    </button>
                 )}
                 {activeModal === 'DETAILS' && (
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium flex items-center gap-2">
                       <CheckCircle size={16}/> Утвердить этап
                    </button>
                 )}
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default OrdersView;