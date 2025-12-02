import { GoogleGenAI, Type } from "@google/genai";
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

export const generateOperationalTasks = async (train: Train): Promise<OperationTask[]> => {
  try {
    const prompt = `
      Act as the Terminal Operating System (TOS) AI Engine.
      Generate 3 to 5 realistic operational tasks (OperationTask) for handling the train: ${train.number}.
      
      Train Context:
      - Direction: ${train.direction}
      - Cargo Type: ${train.cargoType}
      - Wagons: ${train.wagonCount}
      
      Requirements:
      1. Tasks must be technically accurate for a container terminal (UNLOAD, MOVE, INSPECT).
      2. Use realistic equipment IDs (e.g., 'RMG-02', 'RTG-05', 'RS-01') or roles ('Tallyman', 'Customs Officer').
      3. Task descriptions must be in RUSSIAN language, concise and professional.
      4. Assign priorities based on cargo (e.g., Electronics/Reefer = HIGH).
      
      Output JSON only matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['LOAD', 'UNLOAD', 'MOVE', 'INSPECT'] },
              priority: { type: Type.STRING, enum: ['HIGH', 'NORMAL', 'LOW'] },
              status: { type: Type.STRING, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
              assignedTo: { type: Type.STRING },
              targetId: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ['type', 'priority', 'status', 'assignedTo', 'targetId', 'description'],
          },
        },
      },
    });

    const rawTasks = JSON.parse(response.text || "[]");
    
    // Enrich with client-side fields
    return rawTasks.map((t: any, i: number) => ({
      ...t,
      id: `ai-task-${Date.now()}-${i}`,
      timestamp: new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})
    }));

  } catch (error) {
    console.error("AI Task Generation Failed:", error);
    return [];
  }
};