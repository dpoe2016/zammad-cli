import axios, { AxiosInstance } from 'axios';
import { ZammadConfig, Ticket, TicketListOptions, User, Group } from '../types';

export class ZammadClient {
  private client: AxiosInstance;

  constructor(config: ZammadConfig) {
    this.client = axios.create({
      baseURL: `${config.url}/api/v1`,
      headers: {
        'Authorization': `Token token=${config.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Ticket methods
  async getTickets(options: TicketListOptions = {}): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.expand) params.append('expand', 'true');

    const response = await this.client.get<Ticket[]>(`/tickets?${params.toString()}`);
    return response.data;
  }

  async getTicket(id: number): Promise<Ticket> {
    const response = await this.client.get<Ticket>(`/tickets/${id}`);
    return response.data;
  }

  async createTicket(ticketData: Partial<Ticket>): Promise<Ticket> {
    const response = await this.client.post<Ticket>('/tickets', ticketData);
    return response.data;
  }

  async updateTicket(id: number, ticketData: Partial<Ticket>): Promise<Ticket> {
    const response = await this.client.put<Ticket>(`/tickets/${id}`, ticketData);
    return response.data;
  }

  async searchTickets(query: string): Promise<Ticket[]> {
    const response = await this.client.get<Ticket[]>(`/tickets/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const response = await this.client.get<User[]>('/users');
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.client.get<User>(`/users/${id}`);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }

  // Group methods
  async getGroups(): Promise<Group[]> {
    const response = await this.client.get<Group[]>('/groups');
    return response.data;
  }

  async getGroup(id: number): Promise<Group> {
    const response = await this.client.get<Group>(`/groups/${id}`);
    return response.data;
  }
}
