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

export const checkOutAttendance = (params: {
  gps_lat: string;
  gps_lng: string;
  note?: string;
}) => {
  return api.post("/attendances/check-out", null, { params });
};

export const updateAttendanceLateNote = (id: number | string, note: string) => {
  return api.patch(
    `/attendances/${id}/late-note`,
    { note },
    { timeout: 30000 },
  );
};
