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

export const checkInAttendance = (params: {
  gps_lat: string;
  gps_lng: string;
  face_confidence?: number;
  image?: File;
  note?: string;
}) => {
  const formData = new FormData();
  if (params.image) {
    formData.append("image", params.image);
  }

  return api.post("/attendances/check-in", formData, {
    params: {
      gps_lat: params.gps_lat,
      gps_lng: params.gps_lng,
      face_confidence: params.face_confidence,
      note: params.note,
    },
  });
};

export const quickCheckInAttendance = (params: {
  gps_lat: string;
  gps_lng: string;
  image: File;
  note?: string;
}) => {
  const formData = new FormData();
  formData.append("image", params.image);

  return api.post("/attendances/quick-check-in", formData, {
    params: {
      gps_lat: params.gps_lat,
      gps_lng: params.gps_lng,
      note: params.note,
    },
  });
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
