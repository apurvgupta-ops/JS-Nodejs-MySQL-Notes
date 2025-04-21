import axiosInstance from "./axiosInstance";

export const getAllCoursesApi = async () => {
  const { data } = await axiosInstance.get("/courses");
  return data;
};
export const addToCartApi = async (courseId) => {
  const { data } = await axiosInstance.post("/cart", {
    courseId,
  });
  return data;
};
export const getCartItems = async () => {
  const { data } = await axiosInstance.get("/cart");
  return data;
};
export const deleteCartItems = async (courseId) => {
  const { data } = await axiosInstance.delete(`/cart/${courseId}`);
  return data;
};
