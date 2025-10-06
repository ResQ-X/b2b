export interface Asset {
  id: string;
  asset_name: string;
  asset_type: string;
  asset_subtype: string | null;
  fuel_type: string;
  capacity: number;
  plate_number: string | null;
  business_id: string;
  location_id: string;
  created_at: string;
  updated_at: string;
}

export interface FuelOrder {
  id: string;
  status: string;
  date_time: string;
  fuel_type: string;
  service_time_type: string;
  quantity: number;
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

export interface FuelOrdersResponse {
  success: boolean;
  data: FuelOrder[];
  pagination: {
    total: number;
    page: string;
    limit: string;
    totalPages: number;
  };
  metrics: {
    scheduled: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}
