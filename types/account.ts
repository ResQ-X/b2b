export interface User {
  message: string;
  data: {
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
  };
}
export interface UpdateProfileData {
  name?: string;
  company_name?: string;
  company_address?: string;
  tax_id?: string;
  cac?: string;
  email?: string;
  company_email?: string;
  country?: string;
  phone?: string;
  company_phone?: string;
}
export interface ChangePasswordData {
  token: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user?: User;
  data?: any;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}
