// Services
import { API, IResponseAPI } from "@/services/api";

export interface IUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  idLevel: number;
}

export interface IUsersPagination {
  users: IUser[];
  usersInPage: number;
  totalUsers: number;
  totalPages: number;
  page: number;
}

export interface ICreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface IUsersApi {
  getAll: (
    page?: number,
    searchUsername?: string
  ) => Promise<IResponseAPI<IUsersPagination>>;
  findByUsername: (username: string) => Promise<IResponseAPI<IUser>>;
  delete: (id: string) => Promise<IResponseAPI<boolean>>;
  create: (data: ICreateUserData) => Promise<IResponseAPI<IUser>>;
  update: (id: string, data: Partial<IUser>) => Promise<IResponseAPI<IUser>>;
}

export class UsersApi implements IUsersApi {
  api: API;

  constructor(api: API) {
    this.api = api;
  }

  async getAll(page = 1, searchUsername: string = "") {
    return this.api.get<IUsersPagination>("/users", {
      params: {
        page,
        username: searchUsername,
      },
    });
  }

  async findByUsername(username: string) {
    return this.api.get<IUser>(`/users/${username}`);
  }

  async delete(id: string) {
    return this.api.delete(`/users/${id}`);
  }

  async create(data: ICreateUserData) {
    return this.api.post<IUser>(`/users`, data);
  }

  async update(id: string, data: Partial<IUser>) {
    return this.api.patch<IUser>(`/users/${id}`, data);
  }
}

export default new UsersApi(new API());
