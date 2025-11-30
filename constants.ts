import { 
  Container, ContainerStatus, ContainerType, ZoneData, SystemAlert,
  Train, OperationTask, GateEntry, WarehouseItem, ClientOrder 
} from './types';

// --- Containers ---
export const MOCK_CONTAINERS: Container[] = [
  { id: '1', code: 'MSKU-109283-4', type: ContainerType.DRY, size: 40, status: ContainerStatus.IN_YARD, location: { zone: 'A', row: '01', tier: 1 }, owner: 'Maersk', arrivalDate: '2023-10-24T08:00:00Z', contentCategory: 'Электроника', weight: 28000 },
  { id: '2', code: 'CMAU-492812-1', type: ContainerType.REEFER, size: 40, status: ContainerStatus.IN_YARD, location: { zone: 'B', row: '04', tier: 1 }, owner: 'CMA CGM', arrivalDate: '2023-10-25T14:30:00Z', contentCategory: 'Фармацевтика', temperature: -18, weight: 24500 },
  { id: '3', code: 'HLCU-992102-9', type: ContainerType.TANK, size: 20, status: ContainerStatus.GATE_IN, location: { zone: 'C', row: '02', tier: 1 }, owner: 'Hapag-Lloyd', arrivalDate: '2023-10-26T09:15:00Z', contentCategory: 'Химикаты', weight: 22000 },
  { id: '4', code: 'MSKU-881234-2', type: ContainerType.DRY, size: 20, status: ContainerStatus.IN_YARD, location: { zone: 'A', row: '01', tier: 2 }, owner: 'Maersk', arrivalDate: '2023-10-23T11:00:00Z', contentCategory: 'Текстиль', weight: 18000 },
  { id: '5', code: 'OOLU-112233-4', type: ContainerType.OPEN_TOP, size: 40, status: ContainerStatus.MAINTENANCE, location: { zone: 'D', row: '01', tier: 1 }, owner: 'OOCL', arrivalDate: '2023-10-20T16:45:00Z', contentCategory: 'Оборудование', weight: 31000 }
];

// Generate bulk containers
for (let i = 0; i < 40; i++) {
  MOCK_CONTAINERS.push({
    id: `gen-${i}`,
    code: `TCLU-${100000 + i}-${i % 9}`,
    type: ContainerType.DRY,
    size: 40,
    status: ContainerStatus.IN_YARD,
    location: { zone: i % 2 === 0 ? 'A' : 'B', row: `0${(i % 5) + 1}`, tier: (i % 3) + 1 },
    owner: i % 3 === 0 ? 'MSC' : 'COSCO',
    arrivalDate: new Date(Date.now() - i * 86400000).toISOString(),
    contentCategory: 'Генеральный груз',
    weight: 20000 + (i * 100)
  });
}

// --- Zones ---
export const MOCK_ZONES: ZoneData[] = [
  { id: 'A', name: 'Сектор A (Импорт)', capacity: 500, occupancy: 320, type: 'IMPORT' },
  { id: 'B', name: 'Сектор B (Экспорт)', capacity: 400, occupancy: 380, type: 'EXPORT' },
  { id: 'C', name: 'Сектор C (Hazmat)', capacity: 200, occupancy: 45, type: 'HAZMAT' },
  { id: 'D', name: 'Сектор D (Empty)', capacity: 300, occupancy: 120, type: 'EMPTY' },
  { id: 'R1', name: 'Ж/Д Путь 1', capacity: 60, occupancy: 45, type: 'RAIL_SIDE' },
  { id: 'W1', name: 'Склад LCL', capacity: 1000, occupancy: 650, type: 'WAREHOUSE' },
];

// --- Alerts ---
export const MOCK_ALERTS: SystemAlert[] = [
  { id: '1', severity: 'critical', message: 'Рефрижератор CMAU-492812-1 отклонение темп. (+4°C)', timestamp: '2 мин. назад', category: 'TEMP', relatedEntityId: '2' },
  { id: '2', severity: 'medium', message: 'Зона B близка к заполнению (95%)', timestamp: '1 час назад', category: 'OPS' },
  { id: '3', severity: 'low', message: 'Калибровка датчика OCR на КПП-3', timestamp: '4 часа назад', category: 'SYSTEM' },
  { id: '4', severity: 'critical', message: 'Несанкционированное движение в Секторе C', timestamp: '10 мин. назад', category: 'SECURITY' },
];

// --- Trains ---
export const MOCK_TRAINS: Train[] = [
  { id: 't1', number: 'KZT-8821', direction: 'INBOUND', status: 'PROCESSING', eta: '2023-11-01 08:00', etd: '2023-11-02 12:00', wagonCount: 42, cargoType: 'Mixed' },
  { id: 't2', number: 'CHN-9901', direction: 'OUTBOUND', status: 'SCHEDULED', eta: '2023-11-02 14:00', etd: '2023-11-03 06:00', wagonCount: 50, cargoType: 'Electronics' },
  { id: 't3', number: 'RUS-1122', direction: 'INBOUND', status: 'ARRIVED', eta: '2023-11-01 10:30', etd: '2023-11-02 18:00', wagonCount: 38, cargoType: 'Raw Materials' },
];

// --- Tasks ---
export const MOCK_TASKS: OperationTask[] = [
  { id: 'tk1', type: 'UNLOAD', priority: 'HIGH', status: 'IN_PROGRESS', assignedTo: 'Кран RTG-01', targetId: 'KZT-8821', description: 'Разгрузка состава KZT-8821', timestamp: '10:00' },
  { id: 'tk2', type: 'MOVE', priority: 'NORMAL', status: 'PENDING', assignedTo: 'Ричстакер RS-04', targetId: 'MSKU-109283-4', description: 'Перемещение в зону досмотра', timestamp: '10:15' },
  { id: 'tk3', type: 'INSPECT', priority: 'HIGH', status: 'COMPLETED', assignedTo: 'Инспектор Иванов', targetId: 'GATE-01', description: 'Проверка пломб', timestamp: '09:45' },
];

// --- Gate ---
export const MOCK_GATES: GateEntry[] = [
  { id: 'g1', truckPlate: 'A 123 AA 01', driverName: 'Смирнов А.', company: 'TransLog', status: 'GRANTED', gateId: 'G-1', timestamp: '10:45', documentStatus: 'OK' },
  { id: 'g2', truckPlate: 'B 889 BC 02', driverName: 'Ли Вэй', company: 'SilkRoad', status: 'PROCESSING', gateId: 'G-2', timestamp: '10:50', documentStatus: 'OK' },
  { id: 'g3', truckPlate: 'KZ 771 AD', driverName: 'Ержанов Б.', company: 'KazTrans', status: 'DENIED', gateId: 'G-1', timestamp: '10:30', documentStatus: 'EXPIRED' },
];

// --- Warehouse ---
export const MOCK_WAREHOUSE: WarehouseItem[] = [
  { id: 'w1', sku: 'ELEC-001', name: 'Samsung LED TV 55"', quantity: 150, unit: 'шт', location: 'W1-A-12', category: 'Electronics' },
  { id: 'w2', sku: 'AUTO-221', name: 'Тормозные колодки Toyota', quantity: 5000, unit: 'к-т', location: 'W1-B-05', category: 'Auto Parts' },
  { id: 'w3', sku: 'TEXT-991', name: 'Хлопок сырец (тюки)', quantity: 200, unit: 'т', location: 'W1-C-01', category: 'Raw Materials' },
];

// --- Orders ---
export const MOCK_ORDERS: ClientOrder[] = [
  { id: 'o1', clientName: 'Global Trade LLP', type: 'IMPORT', status: 'APPROVED', date: '2023-11-01', volume: '12 Containers' },
  { id: 'o2', clientName: 'Sino-Kazakh Logistics', type: 'TRANSIT', status: 'SUBMITTED', date: '2023-11-01', volume: '1 Train Set' },
  { id: 'o3', clientName: 'AgroExport', type: 'EXPORT', status: 'DRAFT', date: '2023-11-02', volume: '5 Containers' },
];