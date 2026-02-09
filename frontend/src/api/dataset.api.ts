import api from "./axios";

export const getDatasets = (params?: Record<string, any>) => {
  return api.get("/datasets", { params });
};

export const createDataset = (payload: {
  name: number;
  files: File[];
}) => {
  const formData = new FormData();
  formData.append("name", String(payload.name));

  if (payload.files?.length) {
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return api.post("/datasets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteDataset = (id: number) => {
  return api.delete(`/datasets/${id}`);
};
