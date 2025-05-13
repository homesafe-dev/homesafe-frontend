export interface EmployeePivot {
  employer_id: number;
  user_id: number;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  title: string | null;
  username: string | null;
  email: string;
  email_verified_at: string | null;
  avatar: string | null;
  gender: string;
  dob: string | null;
  phone: string | null;
  address: string | null;
  status: number;
  otp_code: string | null;
  otp_expires_at: string | null;
  otp_purpose: string | null;
  is_verified: number;
  salary: string;
  profile_description: string | null;
  password_changed_at: string | null;
  created_at: string;
  updated_at: string;
  pivot: EmployeePivot;
}

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

export interface EmployeesResponse {
  status: boolean;
  message: string;
  data: PaginatedData<Employee>;
}

export interface EmployeeResponse {
  status: boolean;
  message: string;
  data: Employee;
}
