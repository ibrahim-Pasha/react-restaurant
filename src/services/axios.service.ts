import axios, { AxiosResponse } from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

client.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.log("401 error");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    } else if (error instanceof axios.AxiosError) {
      throw new Error(error?.response?.data?.message ?? error.message);
    } else {
      throw error;
    }
  },
);

async function get<T>(
  url: string,
  conf?: { params?: object; headers?: object },
) {
  try {
    const result = await client.request<T, AxiosResponse<T>>({
      method: "GET",
      url,
      responseType: "json",
      params: conf?.params,
      headers: conf?.headers,
    });
    return result.data;
  } catch (e) {
    throw e;
  }
}

async function post<T>(url: string, payload: Object) {
  try {
    const result = await client.request<T, AxiosResponse<T>>({
      method: "POST",
      url,
      responseType: "json",
      data: payload,
    });

    return result.data;
  } catch (e) {
    throw e;
  }
}

async function put<T>(url: string, payload: Object) {
  try {
    const result = await client.request<T, AxiosResponse<T>>({
      method: "PUT",
      url,
      responseType: "json",
      data: payload,
    });

    return result.data;
  } catch (e) {
    throw e;
  }
}

async function remove<T>(url: string) {
  try {
    const result = await client.request<T, AxiosResponse<T>>({
      method: "DELETE",
      url,
      responseType: "json",
    });

    return result.data;
  } catch (e) {
    throw e;
  }
}

export const AxiosService = {
  post,
  get,
  put,
  remove,
};
