import api from "./axios";

export const getAttendances = (params?: Record<string, any>) => {
  return api.get("/attendances", { params });
};

export const getAttendanceHistory = (params: {
  start_date: string;
  end_date: string;
}) => {
  return api.get("/attendances/history", { params });
};
