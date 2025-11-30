export enum ContainerStatus {
  IN_YARD = 'IN_YARD',
  ON_VESSEL = 'ON_VESSEL',
  GATE_IN = 'GATE_IN',
  GATE_OUT = 'GATE_OUT',
  MAINTENANCE = 'MAINTENANCE',
  ON_TRAIN = 'ON_TRAIN',
  WAREHOUSE = 'WAREHOUSE'
}

export enum ContainerType {
  DRY = 'DRY',
  REEFER = 'REEFER',
  OPEN_TOP = 'OPEN_TOP',
  FLAT_RACK = 'FLAT_RACK',
  TANK = 'TANK'
}

export interface Container {
  id: string;
  code: string;
  type: ContainerType;
  size: 20 | 40 | 45;
  status: ContainerStatus;
  location: {
    zone: string;
    row: string;
    tier: number;
  };
  owner: string;
  arrivalDate: string;
  contentCategory: string;
  temperature?: number;
  weight: number;
}

export interface ZoneData {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  type: 'IMPORT' | 'EXPORT' | 'EMPTY' | 'HAZMAT' | 'RAIL_SIDE' | 'WAREHOUSE';
}

export interface SystemAlert {
  id: string;
  severity: 'low' | 'medium' | 'critical';
  message: string;
  timestamp: string;
  relatedEntityId?: string;
  category: 'SECURITY' | 'OPS' | 'TEMP' | 'SYSTEM';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// --- New Modules for GTS-2 ---

export interface Train {
  id: string;
  number: string; // e.g., "KZT-8821"
  direction: 'INBOUND' | 'OUTBOUND';
  status: 'SCHEDULED' | 'ARRIVED' | 'PROCESSING' | 'DEPARTED';
  eta: string;
  etd: string;
  wagonCount: number;
  cargoType: string;
}

export interface OperationTask {
  id: string;
  type: 'LOAD' | 'UNLOAD' | 'MOVE' | 'INSPECT';
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: string; // Operator Name / Machine ID
  targetId: string; // Container ID or Location
  description: string;
  timestamp: string;
}

export interface GateEntry {
  id: string;
  truckPlate: string;
  driverName: string;
  company: string;
  status: 'WAITING' | 'PROCESSING' | 'GRANTED' | 'DENIED';
  gateId: string;
  timestamp: string;
  documentStatus: 'OK' | 'MISSING' | 'EXPIRED';
}

export interface WarehouseItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  category: string;
}

export interface ClientOrder {
  id: string;
  clientName: string;
  type: 'IMPORT' | 'EXPORT' | 'TRANSIT';
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'COMPLETED';
  date: string;
  volume: string; // e.g. "5 Containers"
}