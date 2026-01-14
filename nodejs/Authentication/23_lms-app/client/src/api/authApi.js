import axiosInstance from "./axiosInstance";

export const loginApi = async (userData) => {
  const { data } = await axiosInstance.post("/auth/login", userData);
  return data;
};
export const registrationApi = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const profileApi = async () => {
  const { data } = await axiosInstance.get("/auth/profile");
  return data;
};
