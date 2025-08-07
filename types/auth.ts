export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  country: string;
  phone: string;
  // userType: "ADMIN" | "CUSTOMER_SUPPORT" | "OPERATION_MANAGER";
  userType: "ADMIN";
  password: string;
}

export interface VerifyEmailData {
  email: string;
  token: string;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  country: string;
  phone: string;
  email: string;
  transaction_pin: string | null;
  profile_picture: string | null;
  is_verified: boolean;
  is_online: boolean;
  fcmToken: string | null;
  longitude: number | null;
  latitude: number | null;
  userType: "ADMIN" | "CUSTOMER";
  created_at: string;
  updated_at: string;
}

export interface CreateServiceData {
  service_name: string;
  unit_price: number;
  delivery_price: number;
  service_price: number;
}
