import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { API } from "@/services/api";
import { IUser, IUsersPagination, IUsersApi, UsersApi } from "./users";

describe("UsersApi service", () => {
  let usersApi: IUsersApi;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
    usersApi = new UsersApi(new API());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should get all users with pagination", async () => {
    const mockData: IUsersPagination = {
      users: [
        {
          id: "1",
          username: "john_doe",
          email: "john@example.com",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
          idLevel: 1,
        },
      ],
      usersInPage: 1,
      totalUsers: 1,
      totalPages: 1,
      page: 1,
    };
    mock.onGet("/users").reply(200, mockData);

    const response = await usersApi.getAll();

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(mockData);
  });

  it("should find a user by username", async () => {
    const mockUser: IUser = {
      id: "1",
      username: "john_doe",
      email: "john@example.com",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      idLevel: 1,
    };
    mock.onGet("/users/john_doe").reply(200, mockUser);

    const response = await usersApi.findByUsername("john_doe");

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(mockUser);
  });

  it("should delete a user by id", async () => {
    mock.onDelete("/users/1").reply(200, true);

    const response = await usersApi.delete("1");

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toBe(true);
  });

  it("should create a new user", async () => {
    const mockUser: IUser = {
      id: "1",
      username: "john_doe",
      email: "john@example.com",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      idLevel: 1,
    };
    const userData = {
      username: "john_doe",
      email: "john@example.com",
      password: "password123",
    };
    mock.onPost("/users", userData).reply(201, mockUser);

    const response = await usersApi.create(userData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(201);
    //@ts-expect-error
    expect(response.data).toEqual(mockUser);
  });

  it("should update a user", async () => {
    const mockUser: IUser = {
      id: "1",
      username: "john_doe",
      email: "john@example.com",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      idLevel: 1,
    };
    const userData = {
      username: "john_doe_1",
      email: "john_1@example.com",
    };
    mock
      .onPatch(`/users/${mockUser.id}`, userData)
      .reply(200, { mockUser, ...userData });

    const response = await usersApi.update(mockUser.id, userData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual({ mockUser, ...userData });
  });
});
