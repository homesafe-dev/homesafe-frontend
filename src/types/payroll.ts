// Import pagination types if needed
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PayrollEntry {
  id: number;
  employee_id?: number;
  employee_name?: string;
  staff?: {
    id: number;
    name: string;
    email: string;
  };
  position?: string;
  amount: string | number;
  payment_date?: string;
  advanced_salary?: string | number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // We'll add more fields as we discover them from the API response
}

export interface PayrollResponse {
  status: boolean;
  message: string;
  data: PaginatedData<PayrollEntry> | PayrollEntry[];
}

export interface CreatePayrollData {
  employee_id: number;
  amount: number;
  payment_date: string;
  advanced_salary?: number;
  status?: string;
}

export interface UpdatePayrollData {
  employee_id?: number;
  amount?: number;
  payment_date?: string;
  advanced_salary?: number;
  status?: string;
}
