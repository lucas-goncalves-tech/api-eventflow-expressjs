export interface ITicket {
  id: string;
  event_id: string;
  user_id: string;
  purchased_at: Date;
  created_at?: Date;
  deleted_at?: Date;
}

export interface ITicketAvailability {
  total: number;
  sold: number;
  available: number;
}

export interface ITicketRepository {
  getAvailability(eventId: string): Promise<ITicketAvailability>;
  findByEventAndUser(eventId: string, userId: string): Promise<ITicket | null>;
  create(eventId: string, userId: string): Promise<ITicket>;
  countSold(eventId: string): Promise<number>;
}
