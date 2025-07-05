import apiRequest from "./apiRequest";

export const getAllCategories = (data) => apiRequest("getAllCategories", data);

export const getAvgReviews = (id, data) => apiRequest("getAvgReviews", { id, ...data });

export const verifyLogin = (data) => apiRequest("verifyLogin", data);