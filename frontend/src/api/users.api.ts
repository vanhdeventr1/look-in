import api from "./axios";

export const getUsers = (params?: any) => {
  return api.get("/users", { params });
};

export const createUser = (payload: {
  email: string;
  name: string;
  username: string;
  password: string;
  role: number;
}) => {
  return api.post("/users", payload);
};

export const updateUser = (
  id: number,
  payload: {
    name: string;
    username?: string;
    email: string;
    role: number;
  },
) => {
  return api.put(`/users/${id}`, payload);
};

export const updateCurrentUser = (payload: {
  name?: string;
  email?: string;
  phone_no?: string;
}) => {
  return api.put("/users", payload);
};

export const changePassword = (payload: {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  return api.put("/users/change-password", payload);
};

export const uploadProfilePhoto = (id: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post(`/users/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteUser = (id: number) => {
  return api.delete(`/users/${id}`);
};
