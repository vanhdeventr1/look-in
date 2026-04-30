import api from "./axios";

export const getPermits = (params?: Record<string, any>) => {
  return api.get("/permits", { params });
};

export const getPermit = (id: number) => {
  return api.get(`/permits/${id}`);
};

export const createPermit = (payload: {
  description?: string | null;
  type: number;
  date_start: string | Date;
  date_end: string | Date;
  files?: File[];
}) => {
  const formData = new FormData();
  formData.append("type", String(payload.type));
  if (payload.description !== undefined) {
    formData.append("description", payload.description ?? "");
  }
  formData.append("date_start", String(payload.date_start));
  formData.append("date_end", String(payload.date_end));

  if (payload.files?.length) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return api.post("/permits", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePermit = (
  id: number,
  payload: {
    description?: string | null;
    type?: number;
    status?: number;
    date_start?: string | Date;
    date_end?: string | Date;
    files?: File[];
  },
) => {
  if (payload.files?.length) {
    const formData = new FormData();

    if (payload.type !== undefined) {
      formData.append("type", String(payload.type));
    }
    if (payload.status !== undefined) {
      formData.append("status", String(payload.status));
    }
    if (payload.description !== undefined) {
      formData.append("description", payload.description ?? "");
    }
    if (payload.date_start !== undefined) {
      formData.append("date_start", String(payload.date_start));
    }
    if (payload.date_end !== undefined) {
      formData.append("date_end", String(payload.date_end));
    }

    payload.files.forEach((file) => {
      formData.append("files", file);
    });

    return api.put(`/permits/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return api.put(`/permits/${id}`, payload);
};

export const deletePermit = (id: number) => {
  return api.delete(`/permits/${id}`);
};
