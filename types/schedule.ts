export type OneOffItem = {
  id: string;
  dateISO: string;
  time: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  status: string;
  serviceCategory: string;
};

export type RecurringItem = {
  id: string;
  title: string;
  nextDate: string;
  sub?: string;
  cadence: string;
  icon?: React.ComponentType<any>;
};

// API Types
export type ServiceData = {
  id: string;
  status: string;
  date_time: string;
  fuel_type?: string;
  service_time_type?: string;
  quantity?: number;
  note?: string;
  location: string;
  emergency_type?: string;
  maintenance_type?: string;
  asset: {
    asset_name: string;
    asset_type: string;
  };
  service_category: string;
};
