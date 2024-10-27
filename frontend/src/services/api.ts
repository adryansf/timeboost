import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export interface IApiError {
  message: string;
  error: string;
  statusCode: number;
}

interface IResponseSuccess<T> {
  ok: true;
  statusCode: number;
  data: T;
}

interface IResponseError extends IApiError {
  ok: false;
}

export type IResponseAPI<T> = IResponseSuccess<T> | IResponseError;

export class API {
  api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
    });
  }

  async get<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<IResponseAPI<T>> {
    try {
      const response = await this.api.get<T>(url, config);
      return {
        ok: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (e) {
      const { response } = e as AxiosError<IApiError>;
      const message =
        response?.data?.message ||
        "Aconteceu um erro ao tentar realizar a solicitação!";
      const statusCode = response?.data?.statusCode || 400;
      const error =
        response?.data?.error ||
        "Aconteceu um erro ao tentar realizar a solicitação!";

      return {
        ok: false,
        message,
        statusCode,
        error,
      };
    }
  }

  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<IResponseAPI<T>> {
    try {
      const response = await this.api.post<T>(url, data, config);
      return {
        ok: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (e) {
      const { response } = e as AxiosError<IApiError>;
      const message =
        response?.data?.message ||
        "Aconteceu um erro ao tentar realizar a solicitação!";
      const statusCode = response?.data?.statusCode || 400;
      const error =
        response?.data?.error ||
        "Aconteceu um erro ao tentar realizar a solicitação!";

      return {
        ok: false,
        message,
        statusCode,
        error,
      };
    }
  }

  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<IResponseAPI<T>> {
    try {
      const response = await this.api.put<T>(url, data, config);
      return {
        ok: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (e) {
      const { response } = e as AxiosError<IApiError>;
      const message =
        response?.data?.message ||
        "Aconteceu um erro ao tentar realizar a solicitação!";
      const statusCode = response?.data?.statusCode || 400;
      const error =
        response?.data?.error ||
        "Aconteceu um erro ao tentar realizar a solicitação!";

      return {
        ok: false,
        message,
        statusCode,
        error,
      };
    }
  }

  async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<IResponseAPI<T>> {
    try {
      const response = await this.api.patch<T>(url, data, config);
      return {
        ok: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (e) {
      const { response } = e as AxiosError<IApiError>;
      const message =
        response?.data?.message ||
        "Aconteceu um erro ao tentar realizar a solicitação!";
      const statusCode = response?.data?.statusCode || 400;
      const error =
        response?.data?.error ||
        "Aconteceu um erro ao tentar realizar a solicitação!";

      return {
        ok: false,
        message,
        statusCode,
        error,
      };
    }
  }

  async delete<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<IResponseAPI<T>> {
    try {
      const response = await this.api.delete<T>(url, config);
      return {
        ok: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (e) {
      const { response } = e as AxiosError<IApiError>;
      const message =
        response?.data?.message ||
        "Aconteceu um erro ao tentar realizar a solicitação!";
      const statusCode = response?.data?.statusCode || 400;
      const error =
        response?.data?.error ||
        "Aconteceu um erro ao tentar realizar a solicitação!";

      return {
        ok: false,
        message,
        statusCode,
        error,
      };
    }
  }
}
