export interface IService<T> {
  create(type: Partial<T>): Promise<T>;

  edit(type: Partial<T>): Promise<T>;

  delete(id: number | string): Promise<void>;

  find(id?: number | string, status?: string, term?: string): Promise<T[]>;

  findById(id: number | string): Promise<T>;

  findAll(): Promise<T[]>;
}
