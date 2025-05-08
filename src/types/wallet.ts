export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string | null;
  avatar: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  status: number;
  is_verified: number;
  salary: string;
  profile_description: string | null;
}

export interface Transaction {
  id: number;
  reference_code: string;
  type: string;
  status: string;
  amount: string;
  category: string;
}

export interface WalletTransaction {
  id: number;
  type: string;
  source: string;
  description: string;
  user: User;
  recipient: User;
  transaction: Transaction;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface WalletTransactionsResponse {
  status: boolean;
  message: string;
  data: {
    data: WalletTransaction[];
    links: PaginationLinks;
    meta: PaginationMeta;
  };
}

export interface WalletBalanceResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    user_id: number;
    initial_balance: string;
    current_balance: string;
  };
}
