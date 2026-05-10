export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthUser {
  userId: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface Tool {
  _id: string;
  toolId: string;
  name: string;
  category: string;
  status: 'Available' | 'Issued' | 'Missing';
}

export interface Stats {
  total: number;
  issued: number;
  missing: number;
}

export interface ScanResult {
  correct: string[];
  missing: string[];
  extra: string[];
}
