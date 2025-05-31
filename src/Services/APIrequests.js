import ApiService from "./config";

/*login*/
export const registerUser = (body) => {
  return ApiService.post("/api/users/register", body);
};

export const getCategoriesDetails = (body) => {
  return ApiService.get("/api/categories", body);
};

export const loginUser = (body) => {
  return ApiService.post("api/users/login", body);
};
export const allRegions = (body) => {
  return ApiService.get("/api/serviceareas/regions/", body);
};

export const allPinCodes = (body) => {
  return ApiService.get("api/serviceareas/regions/pincodes", body);
};
