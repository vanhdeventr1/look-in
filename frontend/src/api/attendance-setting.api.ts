import api from "./axios";

export type AttendanceSettingPayload = {
  gps_lat: string;
  gps_lng: string;
  check_in_time: string;
  check_out_time: string;
  radius_meter: number;
};

export const getAttendanceSettings = () => {
  return api.get("/attendance-settings");
};

export const getAttendanceSetting = (id: number) => {
  return api.get(`/attendance-settings/${id}`);
};

export const createAttendanceSetting = (payload: AttendanceSettingPayload) => {
  return api.post("/attendance-settings", payload);
};

export const updateAttendanceSetting = (
  id: number,
  payload: Partial<AttendanceSettingPayload>,
) => {
  return api.put(`/attendance-settings/${id}`, payload);
};

export const deleteAttendanceSetting = (id: number) => {
  return api.delete(`/attendance-settings/${id}`);
};
