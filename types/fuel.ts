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

export interface Business {
  id: string;
  name: string;
  company_name: string;
  company_address: string | null;
  tax_id: string | null;
  cac: string | null;
  email: string;
  company_email: string;
  country: string;
  phone: string;
  company_phone: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  role: string;
}

export interface FuelOrderDetail {
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
  total_cost: string;
  total_service_charge: string;
  total_delivery_charge: string;
  is_under_subscription: boolean;
  created_at: string;
  updated_at: string;
  delivery_spot: string | null;
  is_fill_up: boolean;
  business: Business;
  assets: Asset[];
  order_date: string;
}


