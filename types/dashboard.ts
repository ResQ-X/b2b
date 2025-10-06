export interface Asset {
  id: string;
  asset_name: string;
  asset_type: string;
  asset_subtype: string;
  fuel_type: string;
  capacity: number;
  plate_number: string | null;
  business_id: string;
  location_id: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  location_name: string;
  location_longitude: string;
  location_latitude: string;
  business_id: string;
  created_at: string;
  updated_at: string;
}

export interface FuelBarData {
  month: string;
  quantity: number;
}

export interface FuelChartData {
  data: number[];
  labels: string[];
}

export interface PieChartData {
  legend: Array<{ label: string; value: string; color: string }>;
  slices: number[];
  colors: string[];
}

export interface PieDataResponse {
  fuelCost: number;
  emergencyDeliveries: number;
  maintenanceCost: number;
  serviceCharges: number;
  percentages: {
    fuel: string;
    emergency: string;
    maintenance: string;
    service: string;
  };
}

export interface UpcomingOrder {
  id: string;
  status: string;
  date_time: string;
  fuel_type?: string;
  service_time_type?: string;
  quantity?: number;
  maintenance_type?: string;
  emergency_type?: string;
  note: string;
  location: string;
  location_longitude: string;
  location_latitude: string;
  business_id: string;
  asset_id: string;
  created_at: string;
  updated_at: string;
  asset: Asset;
}

export interface DashboardStats {
  assetCount: number;
  pendingMaintenanceServices: number;
  recentDeliveries: any[];
  upcomingOrdersCount: number;
  upcomingOrders: UpcomingOrder[];
}
