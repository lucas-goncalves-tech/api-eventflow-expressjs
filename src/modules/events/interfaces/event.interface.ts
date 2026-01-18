export type IEvent = {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  starts_at: Date;
  ends_at: Date;
  location?: string;
  capacity?: number;
  created_at?: Date;
  deleted_at?: Date;
};

export type IEventRepository = {
  findById: (id: string) => Promise<IEvent | null>;
  findMany({ search, limit, page }: IEventsQuery): Promise<IFindManyEvents>;
  create: (userId: string, data: ICreateEvent) => Promise<IEvent>;
  update: (id: string, eventData: Partial<IEvent>) => Promise<IEvent>;
  delete: (id: string) => Promise<number | null>;
};

export type ICreateEvent = Omit<
  IEvent,
  "id" | "created_at" | "deleted_at" | "owner_id"
>;

export type IEventsQuery = {
  search?: string;
  limit?: number;
  page?: number;
};

export type IFindManyEvents = {
  data: IEvent[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
};

export type ICreateEventResponse = {
  message: string;
  data: IEvent;
};

export type IUpdateEventResponse = ICreateEventResponse;
