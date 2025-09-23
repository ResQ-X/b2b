export interface LoginFormData {
  email: string;
  password: string;
}
export interface ForgotPasswordFormData {
  email: string;
}
export interface SignupFormData {
  name: string;
  email: string;
  company_name: string;
  company_email: string;
  phone: string;
  company_phone: string;
  country: string;
  password: string;
}
export interface VerifyEmailData {
  email: string;
  code: string;
}
export interface ResendCodeData {
  email: string;
}
export interface requestPasswordResetData {
  email: string;
}
export interface resetPasswordData {
  email: string;
  token: string;
  newPassword: string;
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
  company_name: string;
  company_address: string;
  tax_id: string;
  cac: string;
  email: string;
  company_email: string;
  country: string;
  phone: string;
  company_phone: string;
  password: string;
  transaction_pin: string | null;
  is_verified: boolean;
  fcmToken: string | null;
  refreshToken: string | null;
  created_at: string;
  updated_at: string;
}
export interface CreateServiceData {
  service_name: string;
  unit_price: number;
  delivery_price: number;
  service_price: number;
}
