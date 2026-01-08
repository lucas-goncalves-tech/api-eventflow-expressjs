export interface IEvent {
  id: string;
  title: string;
  description?: string;
  starts_at: Date;
  ends_at: Date;
  location: string;
  capacity: number;
  created_at?: Date;
  deleted_at?: Date;
}
