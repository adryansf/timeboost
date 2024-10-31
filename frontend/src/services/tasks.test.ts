// Importa as dependências necessárias
import { TasksApi, ITask, ICreateTaskData, ITasksApi } from "@/services/tasks";
import { API } from "@/services/api";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("TasksApi", () => {
  let tasksApi: ITasksApi;
  let mockAPI: MockAdapter;

  beforeEach(() => {
    mockAPI = new MockAdapter(axios);
    tasksApi = new TasksApi(new API());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should get all tasks", async () => {
    const tasks: ITask[] = [
      {
        id: 1,
        idUser: "user1",
        title: "Task 1",
        dueDate: "2024-10-31",
        completed: false,
        description: "Description 1",
        createdAt: "2024-10-01",
      },
    ];
    mockAPI.onGet("/tasks").reply(200, tasks);

    const response = await tasksApi.getAll();

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(tasks);
  });

  test("should find task by ID", async () => {
    const task: ITask = {
      id: 1,
      idUser: "user1",
      title: "Task 1",
      dueDate: "2024-10-31",
      completed: false,
      description: "Description 1",
      createdAt: "2024-10-01",
    };
    mockAPI.onGet("/tasks/1").reply(200, task);

    const response = await tasksApi.findById(1);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(task);
  });

  test("should delete task by ID", async () => {
    mockAPI.onDelete("/tasks/1").reply(200, true);

    const response = await tasksApi.delete(1);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toBe(true);
  });

  test("should create a new task", async () => {
    const newTaskData: ICreateTaskData = {
      title: "New Task",
      description: "New Task Description",
      dueDate: "2024-10-31",
      idUser: "user1",
    };
    const createdTask: ITask = {
      ...newTaskData,
      id: 1,
      completed: false,
      createdAt: "2024-10-01",
    };
    mockAPI.onPost("/tasks", newTaskData).reply(201, createdTask);

    const response = await tasksApi.create(newTaskData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(201);
    //@ts-expect-error
    expect(response.data).toEqual(createdTask);
  });

  test("should update an existing task", async () => {
    const updatedTaskData: Partial<ITask> = {
      title: "Updated Task Title",
    };
    const updatedTask: ITask = {
      id: 1,
      idUser: "user1",
      title: "Updated Task Title",
      dueDate: "2024-10-31",
      completed: false,
      description: "Updated Task Description",
      createdAt: "2024-10-01",
    };
    mockAPI
      .onPatch(`/tasks/${updatedTask.id}`, updatedTaskData)
      .reply(200, updatedTask);

    const response = await tasksApi.update(updatedTask.id, updatedTaskData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(updatedTask);
  });
});
