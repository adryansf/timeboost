// Importa as dependências necessárias
import {
  ICreateLevelData,
  ILevel,
  ILevelsApi,
  LevelsApi,
} from "@/services/levels";
import { API } from "@/services/api";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("LevelsApi", () => {
  let levelsApi: ILevelsApi;
  let mockAPI: MockAdapter;
  let levels: ILevel[];

  beforeEach(() => {
    levels = [
      {
        id: 1,
        name: "Iniciante",
        pointsRequired: 0,
      },
      {
        id: 2,
        name: "Médio",
        pointsRequired: 10,
      },
    ];
    mockAPI = new MockAdapter(axios);
    levelsApi = new LevelsApi(new API());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should get all levels", async () => {
    mockAPI.onGet("/levels").reply(200, levels);

    const response = await levelsApi.getAll();

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(levels);
  });

  test("should delete level by ID", async () => {
    mockAPI.onDelete("/levels/1").reply(200, true);

    const response = await levelsApi.delete(1);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toBe(true);
  });

  test("should create a new level", async () => {
    const newLevelData: ICreateLevelData = {
      name: "Médio",
      pointsRequired: 10,
    };
    const createdLevel: ILevel = {
      ...newLevelData,
      id: 3,
    };
    mockAPI.onPost("/levels", newLevelData).reply(201, createdLevel);

    const response = await levelsApi.create(newLevelData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(201);
    //@ts-expect-error
    expect(response.data).toEqual(createdLevel);
  });

  test("should update an existing level", async () => {
    const updateLevelData: Partial<ILevel> = {
      pointsRequired: 100,
    };
    const updatedLevel: ILevel = {
      ...levels[0],
      ...updateLevelData,
    };
    mockAPI
      .onPatch(`/levels/${updatedLevel.id}`, updateLevelData)
      .reply(200, updatedLevel);

    const response = await levelsApi.update(updatedLevel.id, updateLevelData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(updatedLevel);
  });
});
