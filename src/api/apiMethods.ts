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

export const gettechnicianPlanById = (id: string) => apiRequest("gettechnicianPlanById", null, id);

export const addTechSubscriptionPlan = (data: any) => apiRequest("addTechSubscriptionPlan", data);

export const getTechImagesByTechId = (id: string) => apiRequest("getTechImagesByTechId", null, id);

export const getServicesByTechId = (id: string) => apiRequest("getServicesByTechId", null, id);

export const getTechnicianReviews = (id: string) => apiRequest("getTechnicianReviews", null, id);

export const updateTechnicianControl = (formData: FormData) => apiRequest("updateTechnicianControl", formData);

export const updateServiceControl = (formData: FormData) => apiRequest("updateServiceControl", formData);

export const createServiceControl = (formData: FormData) => apiRequest("createServiceControl", formData);

export const deleteServiceById = (id: string) => apiRequest("deleteServiceById", null, id);

export const createTechImagesControl = (formData: FormData) => apiRequest("createTechImagesControl", formData);

export const getAllPincodes = () => apiRequest("getAllPincodes");

export const getAllTechnicianDetails = (id: string) => apiRequest("getAllTechnicianDetails", null, id);



export const getCompanyReviews = (data: any) => apiRequest('getCompanyReviews', data)

export const createGuestBooking = (formData: any) =>apiRequest('createGuestBooking', formData)
export const addToCart = (data: any) => apiRequest("addToCart", data);

export const getCartItems = (id: string) => apiRequest("getCartItems", null, id);

export const removeFromCart = (data: any) => apiRequest("removeFromCart", data);

export const createBookService = (data: any) => apiRequest("createBookService", data);

export const getOrdersByUserId = (id: string) => apiRequest("getOrdersByUserId", null, id);

export const getOrdersByTechnicianId = (id: string) => apiRequest("getOrdersByTechnicianId", null, id);

export const bookingCancleByUser = (data: any) => apiRequest("bookingCancleByUser", data);
export const updateBookingStatus = (data: any) => apiRequest("updateBookingStatus", data);
export const createGetInTouch = (formData: any) =>apiRequest('createGetInTouch', formData)

export const createFranchaseEnquiry = (formData: any) => apiRequest('createFranchaseEnquiry',formData)

export const createCompanyReview = (formData: any) => apiRequest('createCompanyReview',formData)

export const getAllTechByAddress = (formData :any) => apiRequest('getAllTechByAddress',formData)

export const getSearchContentByAddress = (formData :any) => apiRequest('getSearchContentByAddress',formData)

export const getTechByCategorie = (id: string) =>apiRequest('getTechByCategorie', null , id)

export const deletePhotoBySingle = (payload : any) =>apiRequest('deletePhotoBySingle', payload)

export const addReviewByUser= (formData :any ) => apiRequest('addReviewByUser', formData)

export const getFranchisePlans = (data: any) => apiRequest('getFranchisePlans', data);

export const getAllServicesByCatId = (id: string) =>apiRequest('getAllServicesByCatId', null , id)

export const getCategoryServicesByTechId = (id: string) =>apiRequest('getCategoryServicesByTechId', null , id)

export const changeServiceStatusByTechId = (payload: any) =>apiRequest('changeServiceStatusByTechId', payload)

export const getTodaybookingBytechId = (id: string) => apiRequest("getTodaybookingBytechId", null, id);

export const getMonthlyBookingByTechId = (id: string) => apiRequest("getMonthlyBookingByTechId", null, id);

export const getBookingDashboardByTechId = (id: string) => apiRequest("getBookingDashboardByTechId", null, id);

export const getAllBlogs = (data: any) => apiRequest("getAllBlogs", data);

// export const getAllTechnicianDetails = async (id: string) => {
//   const res = await fetch(`/api/techDetails/getTechAllDetails/${id}`);
//   const data = await res.json();
//   return data;
// };