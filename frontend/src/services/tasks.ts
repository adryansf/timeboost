// Services
import { API, IResponseAPI } from "@/services/api";

export interface ITask {
  id: number;
  idUser: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
  createdAt: string;
}

export interface ICreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  idUser: string;
  completed?: boolean;
}

export interface ITasksApi {
  getAll: () => Promise<IResponseAPI<ITask[]>>;
  findById: (id: number) => Promise<IResponseAPI<ITask>>;
  delete: (id: number) => Promise<IResponseAPI<boolean>>;
  create: (data: ICreateTaskData) => Promise<IResponseAPI<ITask>>;
  update: (id: number, data: Partial<ITask>) => Promise<IResponseAPI<ITask>>;
}

export class TasksApi implements ITasksApi {
  api: API;

  constructor(api: API) {
    this.api = api;
  }

  async getAll() {
    return this.api.get<ITask[]>("/tasks");
  }

  async findById(id: number) {
    return this.api.get<ITask>(`/tasks/${id}`);
  }

  async delete(id: number) {
    return this.api.delete(`/tasks/${id}`);
  }

  async create(data: ICreateTaskData) {
    return this.api.post<ITask>(`/tasks`, data);
  }

  async update(id: number, data: Partial<ITask>) {
    return this.api.patch<ITask>(`/tasks/${id}`, data);
  }
}

export default new TasksApi(new API());
