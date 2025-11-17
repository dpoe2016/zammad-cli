export interface ZammadConfig {
  url: string;
  token: string;
}

export interface Ticket {
  id: number;
  title: string;
  state_id: number;
  priority_id: number;
  group_id: number;
  customer_id: number;
  organization_id?: number;
  owner_id: number;
  created_at: string;
  updated_at: string;
  number: string;
  state: string;
  priority: string;
  group: string;
  customer: string;
  owner: string;
  [key: string]: any;
}

export interface TicketListOptions {
  page?: number;
  per_page?: number;
  expand?: boolean;
}

export interface User {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  email: string;
  organization_id?: number;
  role_ids: number[];
  active: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface Group {
  id: number;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}
