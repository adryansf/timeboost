import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { API, IApiError } from "./api";

describe("API service", () => {
  let api: API;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
    api = new API();
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it("should return data on a successful GET request", async () => {
    const mockData = { message: "Success" };
    mock.onGet("/test").reply(200, mockData);

    const response = await api.get("/test");

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    expect(response).toHaveProperty("data");
    //@ts-expect-error
    expect(response.data).toEqual(mockData);
  });

  it("should return an error on a failed GET request", async () => {
    const dataMock: IApiError = {
      message: "Not found",
      error: "Not found",
      statusCode: 404,
    };

    mock.onGet("/test").reply(404, dataMock);

    const response = await api.get("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(dataMock.statusCode);
    //@ts-expect-error
    expect(response.error).toBe(dataMock.error);
    //@ts-expect-error
    expect(response.message).toBe(dataMock.message);
  });

  it("should return data on a successful POST request", async () => {
    const mockData = { message: "Created" };
    const postData = { name: "Test" };
    mock.onPost("/test", postData).reply(201, mockData);

    const response = await api.post("/test", postData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(201);

    if (response.ok) expect(response.data).toEqual(mockData);
  });

  it("should return an error on a failed POST request", async () => {
    const dataMock: IApiError = {
      message: "Error on Create",
      error: "Error on Create",
      statusCode: 400,
    };

    mock.onPost("/test").reply(400, dataMock);

    const response = await api.post("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(dataMock.statusCode);
    //@ts-expect-error
    expect(response.error).toBe(dataMock.error);
    //@ts-expect-error
    expect(response.message).toBe(dataMock.message);
  });

  it("should return data on a successful PUT request", async () => {
    const mockData = { message: "Updated" };
    const putData = { name: "Test Updated" };
    mock.onPut("/test", putData).reply(200, mockData);

    const response = await api.put("/test", putData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(mockData);
  });

  it("should return an error on a failed PUT request", async () => {
    const dataMock: IApiError = {
      message: "Error on PUT",
      error: "Error on PUT",
      statusCode: 400,
    };

    mock.onPut("/test").reply(400, dataMock);

    const response = await api.put("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(dataMock.statusCode);
    //@ts-expect-error
    expect(response.error).toBe(dataMock.error);
    //@ts-expect-error
    expect(response.message).toBe(dataMock.message);
  });

  it("should return data on a successful DELETE request", async () => {
    const mockData = { message: "Deleted" };
    mock.onDelete("/test").reply(200, mockData);

    const response = await api.delete("/test");

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(mockData);
  });

  it("should return an error on a failed DELETE request", async () => {
    const dataMock: IApiError = {
      message: "Internal Server Error",
      error: "Internal Server Error",
      statusCode: 500,
    };

    mock.onDelete("/test").reply(dataMock.statusCode, dataMock);

    const response = await api.delete("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(dataMock.statusCode);
    //@ts-expect-error
    expect(response.error).toBe(dataMock.error);
    //@ts-expect-error
    expect(response.message).toBe(dataMock.message);
  });

  it("should return data on a successful PUT request", async () => {
    const mockData = { message: "Updated" };
    const putData = { name: "Test Updated" };
    mock.onPut("/test", putData).reply(200, mockData);

    const response = await api.put("/test", putData);

    expect(response.ok).toBe(true);
    expect(response.statusCode).toBe(200);
    //@ts-expect-error
    expect(response.data).toEqual(mockData);
  });

  it("should return an error on a failed PATCH request", async () => {
    const dataMock: IApiError = {
      message: "Error on PATCH",
      error: "Error on PATCH",
      statusCode: 400,
    };

    mock.onPatch("/test").reply(dataMock.statusCode, dataMock);

    const response = await api.patch("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(dataMock.statusCode);
    //@ts-expect-error
    expect(response.error).toBe(dataMock.error);
    //@ts-expect-error
    expect(response.message).toBe(dataMock.message);
  });

  it("should return an error with default message on requests", async () => {
    // GET
    const dataMock = {};

    mock.onGet("/test").reply(400, dataMock);

    let response = await api.get("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(400);
    //@ts-expect-error
    expect(response.error).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );
    //@ts-expect-error
    expect(response.message).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );

    // POST
    mock.onPost("/test").reply(400, dataMock);

    response = await api.post("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(400);
    //@ts-expect-error
    expect(response.error).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );
    //@ts-expect-error
    expect(response.message).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );

    // PUT
    mock.onPut("/test").reply(400, dataMock);

    response = await api.put("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(400);
    //@ts-expect-error
    expect(response.error).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );
    //@ts-expect-error
    expect(response.message).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );

    // PATCH
    mock.onPatch("/test").reply(400, dataMock);

    response = await api.patch("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(400);
    //@ts-expect-error
    expect(response.error).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );
    //@ts-expect-error
    expect(response.message).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );

    // DELETE
    mock.onDelete("/test").reply(400, dataMock);

    response = await api.delete("/test");

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(400);
    //@ts-expect-error
    expect(response.error).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );
    //@ts-expect-error
    expect(response.message).toBe(
      "Aconteceu um erro ao tentar realizar a solicitação!"
    );
  });
});
