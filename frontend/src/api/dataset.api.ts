import api from "./axios";
import type { AxiosRequestConfig } from "axios";

export const getDatasets = (params?: Record<string, any>) => {
  return api.get("/datasets", { params });
};

export const getDataset = (id: number) => {
  return api.get(`/datasets/${id}`);
};

export const createDataset = (
  payload: {
    user_id: number;
    files: File[];
  },
  config?: AxiosRequestConfig,
) => {
  const formData = new FormData();
  formData.append("user_id", String(payload.user_id));

  if (payload.files?.length) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return api.post("/datasets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 600000,
    ...config,
  });
};

export const deleteDataset = (id: number) => {
  return api.delete(`/datasets/${id}`);
};
