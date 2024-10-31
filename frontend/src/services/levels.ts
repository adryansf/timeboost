// Services
import { API, IResponseAPI } from "@/services/api";

export interface ILevel {
  id: number;
  name: string;
  pointsRequired: number;
}

export interface ICreateLevelData {
  name: string;
  pointsRequired: number;
}

export interface ILevelsApi {
  getAll: () => Promise<IResponseAPI<ILevel[]>>;
  delete: (id: number) => Promise<IResponseAPI<boolean>>;
  create: (data: ICreateLevelData) => Promise<IResponseAPI<ILevel>>;
  update: (
    id: number,
    data: Partial<ICreateLevelData>
  ) => Promise<IResponseAPI<ILevel>>;
}

export class LevelsApi implements ILevelsApi {
  api: API;

  constructor(api: API) {
    this.api = api;
  }

  async getAll() {
    return this.api.get<ILevel[]>("/levels");
  }

  async delete(id: number) {
    return this.api.delete(`/levels/${id}`);
  }

  async create(data: ICreateLevelData) {
    return this.api.post<ILevel>(`/levels`, data);
  }

  async update(id: number, data: Partial<ILevel>) {
    return this.api.patch<ILevel>(`/levels/${id}`, data);
  }
}

export default new LevelsApi(new API());
