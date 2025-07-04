import apiRequest from "./apiRequest";

export const getAllCategories = (data) => apiRequest("getAllCategories", data);

export const login = (data) => apiRequest("login", data);