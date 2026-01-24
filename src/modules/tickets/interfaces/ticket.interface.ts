import type { PoolClient } from "pg";

export interface ITicket {
  id: string;
  event_id: string;
  user_id: string;
  purchased_at: Date;
  price_paid: number;
  deleted_at?: Date;
}

export interface ICreateTicketDTO {
  event_id: string;
  user_id: string;
  price_paid: number;
  purchased_at?: Date;
}

export interface ITicketRepository {
  create(data: ICreateTicketDTO, client: PoolClient): Promise<ITicket>;
  findByEventAndUser(eventId: string, userId: string): Promise<ITicket | null>;
  findByUser(userId: string): Promise<ITicket[]>;
}
