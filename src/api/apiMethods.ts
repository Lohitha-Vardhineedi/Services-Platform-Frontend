import apiRequest from "./apiRequest";

export const getAllCategories = (data: any) => apiRequest("getAllCategories", data);

export const getAvgReviews = (id: string, data: any) => apiRequest("getAvgReviews", { id, ...data });

export const verifyLogin = (data: any) => apiRequest("verifyLogin", data);
export const login = (data: any) => apiRequest("login", data);

export const register = (data: any) => apiRequest("register", data);

export const getUserProfile = (userId: string) => apiRequest("getUserProfile", null, userId);

export const updateUserProfile = (userId: string, data: any) => apiRequest("updateUserProfile", data, userId);

export const userRegister = (data: any) => apiRequest("userRegister", data);
export const technicianRegister = (data: any) => apiRequest("technicianRegister", data);

export const userLogin = (data: any) => apiRequest("userLogin", data);
export const technicianLogin = (data: any) => apiRequest("technicianLogin", data);

export const userGetProfile = (userId: string) => apiRequest("getUserProfile", null, userId);
export const userEditProfile = (data: any) => apiRequest("userEditProfile", data);
export const technicianGetProfile = (userId: string) => apiRequest("technicianGetProfile", null, userId);
export const technicianEditProfile = (data: any) => apiRequest("technicianEditProfile", data);
