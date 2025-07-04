import apiRequest from "./apiRequest";

export const getAllCategories = (data) => apiRequest("getAllCategories", data);