import { GoogleGenAI } from "@google/genai";
import { 
  Container, ZoneData, SystemAlert, 
  Train, OperationTask, GateEntry, WarehouseItem, ClientOrder 
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface FullTerminalState {
  containers: Container[];
  zones: ZoneData[];
  alerts: SystemAlert[];
  trains: Train[];
  tasks: OperationTask[];
  gates: GateEntry[];
  warehouse: WarehouseItem[];
  orders: ClientOrder[];
}

export const analyzeTerminalState = async (
  query: string,
  state: FullTerminalState
): Promise<string> => {
  try {
    const context = `
      Вы — ИИ-операционный директор системы GTS-2 (Global Terminal System).
      Ваша задача: управление мультимодальным терминалом (ЖД, Авто, Склад).
      
      ТЕКУЩЕЕ СОСТОЯНИЕ ТЕРМИНАЛА:
      
      1. ЖЕЛЕЗНАЯ ДОРОГА (TRAINS):
      ${JSON.stringify(state.trains.map(t => `${t.number} (${t.direction}): ${t.status}, Вагонов: ${t.wagonCount}`))}
      
      2. ЗАДАЧИ ПЕРСОНАЛА (OPS TASKS):
      ${JSON.stringify(state.tasks.filter(t => t.status !== 'COMPLETED').map(t => `${t.priority} - ${t.type}: ${t.description} (${t.assignedTo})`))}
      
      3. КПП И АВТО (GATES):
      В ожидании: ${state.gates.filter(g => g.status === 'WAITING' || g.status === 'PROCESSING').length} машин.
      Последние события: ${JSON.stringify(state.gates.slice(0, 3).map(g => `${g.truckPlate} - ${g.status}`))}
      
      4. СКЛАД (WMS):
      Ключевые позиции: ${JSON.stringify(state.warehouse.slice(0, 3))}
      
      5. ЗОНЫ И ЗАПОЛНЕННОСТЬ:
      ${JSON.stringify(state.zones.map(z => `${z.name}: ${Math.round(z.occupancy/z.capacity*100)}%`))}
      
      6. АКТИВНЫЕ АЛЕРТЫ:
      ${JSON.stringify(state.alerts)}

      Запрос пользователя: "${query}"

      Отвечайте на русском языке. Будьте профессиональны, кратки и точны. 
      Если обнаружена проблема (например, критический алерт или задержка поезда), предложите решение.
      Используйте терминологию логистики (TEU, Ричстакер, ЖД-накладная, СВХ).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });

    return response.text || "Данные приняты, но текстовый ответ не сгенерирован.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Система GTS-2 временно недоступна для когнитивного анализа. Проверьте соединение с сервером.";
  }
};