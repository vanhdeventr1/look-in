import api from "./axios";

export const getPermits = (params?: Record<string, any>) => {
  return api.get("/permits", { params });
};

export const getPermit = (id: number) => {
  return api.get(`/permits/${id}`);
};

export const updatePermit = (
  id: number,
  payload: {
    description?: string | null;
    type?: number;
    status?: number;
    date_start?: string | Date;
    date_end?: string | Date;
  },
) => {
  return api.put(`/permits/${id}`, payload);
};

