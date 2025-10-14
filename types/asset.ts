export type AssetForm = {
  asset_name: string;
  asset_type: string;
  asset_subtype: string;
  fuel_type: string;
  capacity: number;
  plate_number: string;
  location_id: string;
  location: string;
  longitude: string;
  latitude: string;
};

export type Location = {
  id: string;
  location_name: string;
  location_longitude: string;
  location_latitude: string;
  business_id: string;
  created_at: string;
  updated_at: string;
};

export interface GooglePlacePrediction {
  description: string;
  place_id: string;
}
