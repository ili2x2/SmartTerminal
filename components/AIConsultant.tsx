
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, Info } from 'lucide-react';
import { ChatMessage, Container, ZoneData, SystemAlert } from '../types';
import { analyzeTerminalState } from '../services/geminiService';
import { MOCK_TRAINS, MOCK_TASKS, MOCK_GATES, MOCK_WAREHOUSE, MOCK_ORDERS } from '../constants';

interface Props {
  containers: Container[];
  zones: ZoneData[];
  alerts: SystemAlert[];
}

const AIConsultant: React.FC<Props> = ({ containers, zones, alerts }) => {
  const [query, setQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Вас приветствует модуль SmartTerminal Cortex. Я имею полный доступ к оперативным данным: Ж/Д график, Склад WMS, КПП и Контейнерный терминал. Какую информацию предоставить?",
      timestamp: new Date()
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date()
    };

    setHistory(prev => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    try {
      // Aggregate full state for the AI
      const fullState = {
        containers,
        zones,
        alerts,
        trains: MOCK_TRAINS,
        tasks: MOCK_TASKS,
        gates: MOCK_GATES,
        warehouse: MOCK_WAREHOUSE,
        orders: MOCK_ORDERS
      };

      const responseText = await analyzeTerminalState(userMsg.text, fullState);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Сбой подключения к ядру нейросети. Пожалуйста, повторите запрос.",
        timestamp: new Date()
      };
      setHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Chat Interface */}
      <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col shadow-2xl overflow-hidden relative">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-between items-center backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg shadow-lg shadow-purple-500/30 dark:shadow-purple-900/50">
               <Bot size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white leading-tight">SmartTerminal Cortex</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Системы в норме</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50 dark:bg-zinc-950/50" ref={scrollRef}>
          {history.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md ${
                  msg.role === 'user' ? 'bg-zinc-200 dark:bg-zinc-700' : 'bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-500/30'
                }`}>
                  {msg.role === 'user' ? <User size={16} className="text-zinc-600 dark:text-zinc-300" /> : <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />}
                </div>
                
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-2 opacity-60 font-mono ${msg.role === 'user' ? 'text-blue-100' : 'text-zinc-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isThinking && (
             <div className="flex justify-start">
               <div className="flex gap-4 max-w-[80%]">
                 <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center mt-1">
                   <Loader2 size={16} className="text-purple-600 dark:text-purple-400 animate-spin" />
                 </div>
                 <div className="p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-tl-sm shadow-sm">
                   <div className="flex gap-1 h-5 items-center">
                     <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                     <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                     <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                   </div>
                 </div>
               </div>
             </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите команду или запрос..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-200 rounded-xl border border-zinc-300 dark:border-zinc-700 p-4 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none h-14 placeholder-zinc-400"
            />
            <button 
              onClick={handleSend}
              disabled={isThinking || !query.trim()}
              className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Actions / Context Panel */}
      <div className="hidden lg:block w-80 space-y-4">
         <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Оперативные сценарии</h3>
            <div className="space-y-2">
              <ActionButton onClick={() => setQuery("Где находится поезд KZT-8821 и какой у него статус?")} label="Статус поезда KZT-8821" />
              <ActionButton onClick={() => setQuery("Есть ли пробки на КПП прямо сейчас?")} label="Анализ загрузки КПП" />
              <ActionButton onClick={() => setQuery("Сколько места осталось на складе LCL (W1)?")} label="Запрос остатков WMS" />
              <ActionButton onClick={() => setQuery("Покажи все незавершенные задачи высокого приоритета.")} label="Задачи высокого приоритета" />
            </div>
         </div>

         <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border border-purple-200 dark:border-purple-500/20 rounded-xl p-5">
            <h3 className="font-semibold text-purple-700 dark:text-purple-200 mb-2 flex items-center gap-2 text-sm">
              <Sparkles size={16} /> Data Lake Connected
            </h3>
            <div className="text-xs text-purple-600/60 dark:text-purple-300/60 space-y-2 font-mono">
               <div className="flex justify-between">
                 <span>TRAINS_DB</span>
                 <span className="text-emerald-600 dark:text-emerald-400">ONLINE</span>
               </div>
               <div className="flex justify-between">
                 <span>WMS_CORE</span>
                 <span className="text-emerald-600 dark:text-emerald-400">ONLINE</span>
               </div>
               <div className="flex justify-between">
                 <span>GATE_OCR</span>
                 <span className="text-emerald-600 dark:text-emerald-400">ONLINE</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

const ActionButton = ({ onClick, label }: any) => (
  <button onClick={onClick} className="w-full text-left p-3 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-300">
    {label}
  </button>
);

export default AIConsultant;
