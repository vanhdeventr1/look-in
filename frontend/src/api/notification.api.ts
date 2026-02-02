import api from "./axios";

export const getNotifications = (params?: Record<string, any>) => {
  return api.get("/notifications", { params });
};

export const markAllNotificationsAsRead = () => {
  return api.put("/notifications/mark-all-as-read");
};

export const markNotificationAsRead = (id: string) => {
  return api.put(`/notifications/${id}/mark-as-read`);
};
