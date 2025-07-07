import apiRequest from "./apiRequest";

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const getAvgReviews = (id, data) => apiRequest("getAvgReviews", { id, ...data });

export const verifyLogin = (data) => apiRequest("verifyLogin", data);
export const login = (data: any) => apiRequest("login", data);

export const register = (data: any) => apiRequest("register", data);

export const getUserProfile = (userId: string) => apiRequest("getUserProfile", null, userId);

export const updateUserProfile = (userId: string, data: any) => apiRequest("updateUserProfile", data, userId);

export const getPlans = () => apiRequest("getPlans");