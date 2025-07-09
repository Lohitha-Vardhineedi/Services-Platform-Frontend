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
export const technicianGetProfile = (userId: string) => apiRequest("technicianGetProfileDetails", null, userId);
export const technicianEditProfile = (data: any) => apiRequest("technicianEditProfile", data);
export const getPlans = (data: any) => apiRequest("getPlans",data);

export const getTechImagesByTechId = (id: string) => apiRequest("getTechImagesByTechId", null, id);

export const getServicesByTechId = (id: string) => apiRequest("getServicesByTechId", null, id);

export const updateTechnicianControl = (formData: FormData) => apiRequest("updateTechnicianControl", formData);

export const updateServiceControl = (formData: FormData) => apiRequest("updateServiceControl", formData);

export const createServiceControl = (formData: FormData) => apiRequest("createServiceControl", formData);

export const deleteServiceById = (id: string) => apiRequest("deleteServiceById", null, id);

export const createTechImagesControl = (formData: FormData) => apiRequest("createTechImagesControl", formData);

export const getAllPincodes = () => apiRequest("getAllPincodes");
