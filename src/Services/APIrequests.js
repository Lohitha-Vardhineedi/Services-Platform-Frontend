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

export const resetPassword = (body, token) => {
  return ApiService.post(`/users/resetPassword?token=${token}`, body);
};

export const generateOtp = (body) => {
  return ApiService.post("/admin/login", body);
};

export const verifyOtp = (body) => {
  return ApiService.post("/users/verifyOtp", body);
};

export const forgotPassword = (body) => {
  return ApiService.post("/users/forgotPassword", body);
};

/*razorpay*/
export const createRazorpayOrder = (body) => {
  return ApiService.post("/payments/createRazorpayOrder", body);
};

export const handlePaymentSuccess = (body) => {
  return ApiService.post("/payments/handlePaymentSuccess", body);
};

// company details
export const create_companies = (cin, params) => {
  const queryParams = new URLSearchParams(params).toString();
  return ApiService.get(`/tabData/${cin}?${queryParams}`);
};

/*reference doucument */
export const referenceDocument = (page, limit, documentCategory, cin) => {
  return ApiService.get(
    `/referenceDocument?cin=${cin}&documentCategory=${documentCategory}&page=${page}&limit=${limit}`
  );
};

/*open charges*/
export const getChargeDetails = (cin) => {
  return ApiService.get(`chargeDetail?CIN=${cin}`);
};

/*index of charges*/
export const getIndexopenCharges = (cin) => {
  return ApiService.get(`chargeDetail/openCharges?CIN=${cin}`);
};

/*finacial data*/
export const getfinacialdata = (cin) => {
  return ApiService.get(`/companies/${cin}/financial-data`);
};

/*structure*/
export const getstructuredata = (cin) => {
  return ApiService.get(`/companies/${cin}/structure`);
};

/*highlights*/

export const gethighlightsdata = (cin) => {
  return ApiService.get(`/companies/${cin}/highlights`);
};

/*compliance check*/

export const getcompliancecheck = (cin) => {
  return ApiService.get(`tabdata/compliance/${cin}`);
};

export const getAboutTheCompany = (cin) => {
  return ApiService.get(`/tabdata/aboutTheCompany/${cin}`);
};

export const getDirector = (cin) => {
  return ApiService.get(`/tabdata/director/${cin}`);
};

/*Search api home*/
export const searchByName = (name) => {
  return ApiService.get(`companies/search?name=${name}`);
};

export const searchCompanies = (query) => {
  return ApiService.get(`companies/search?${query}`);
};

export const searchCompaniesById = (cin, token) => {
  return ApiService.get(`companies/${cin}`, token);
};

/*my kohere*/
export const getCategoryDetails = (token) => {
  return ApiService.get("/category");
};
export const getSubCategoryDetails = (token) => {
  return ApiService.get("/subcategory");
};
export const getUserData = (token) => {
  return ApiService.get("/costumer");
};

export const createCategory = (token, requestBody) => {
  return ApiService.post("/category/create", requestBody);
};
export const updateCategory = (token, requestBody) => {
  return ApiService.post("/category/update", requestBody);
};
export const deleteCategory = (id) => {
  return ApiService.post(`/category/delete/${id}`);
};
export const deleteSubCategory = (id) => {
  return ApiService.post(`/subcategory/${id}`);
};
export const createSubCategory = (token, requestBody) => {
  return ApiService.post("/subcategory/create", requestBody);
};

export const getPurchasedCompaniesByUser = (token) => {
  return ApiService.get("/purchases/getPurchasedCompaniesByUser");
};

/*my kohere credits details*/

export const creditPricing = () => {
  return ApiService.get("/creditPricing");
};

/*resources*/
export const getAllresources = () => {
  return ApiService.get("/resources");
};

export const getResourceById = (id) => {
  return ApiService.get(`/resources/${id}`);
};

export const getcreditPurchaseHistory = () => {
  return ApiService.get(`/creditPurchaseHistory`);
};

// export const getbusinessForSale = () => {
//   return ApiService.get(`/businessForSale`);
// };

/*Banners*/
export const getAllbanners = () => {
  return ApiService.get("/banners");
};

/*Services*/
export const getAllServices = () => {
  return ApiService.get("/services");
};

export const getSubCategoryServices = () => {
  return ApiService.get("/services/byCategory");
};

export const getservicedropdown = () => {
  return ApiService.get("/serviceCategory/categoriesAndSubcategories");
};

export const getAllServiceSubCategoryId = (id) => {
  return ApiService.get(`/services/bySubCategory/${id}`);
};
export const getSubCategoriesByCategoryId = (id) => {
  return ApiService.get(`/subcategory/category/${id}`);
};
export const getusersBySubCategoryId = (id) => {
  return ApiService.get(`/customer/${id}`);
};
export const getAllServiceByCategoryIdAndSubCategory = (
  CategoryId,
  subcategoryId
) => {
  return ApiService.get(
    `services/byCategoryId/${CategoryId}/subcategoryId/${subcategoryId}`
  );
};

export const getServicesById = (id) => {
  return ApiService.get(`/services/${id}`);
};

export const getAllpartners = () => {
  return ApiService.get("/partners");
};

export const updateUserdetails = (updateData) => {
  return ApiService.put("/users/updateUser", updateData);
};

export const getUserHistory = () => {
  return ApiService.get("/history");
};

export const getUserblogs = () => {
  return ApiService.get("/blogs");
};

export const blogsreplay = (requestData) => {
  return ApiService.post("/blogReplies", requestData);
};

export const getblogCategories = () => {
  return ApiService.get("/blogCategories");
};

export const getUserblogsbyid = (id) => {
  return ApiService.get(`/blogs/${id}`);
};

export const gettestimonial = () => {
  return ApiService.get(`/testimonial`);
};

export const gethomefaqs = () => {
  return ApiService.get(`/faqs`);
};

export const getContactBusinesslabels = () => {
  return ApiService.get(`/interestedInContactInquiry`);
};

export const contactInquiry = (body) => {
  return ApiService.post(`/contactInquiry`, body);
};

export const BusinessesforSalecardscreate = (body) => {
  return ApiService.post(`/businessForSale`, body);
};

export const BusinessesforSalecardbyId = (CIN) => {
  return ApiService.get(`/businessForSale/${CIN}`);
};

export const ComplianceCalendar = (startMonth, endMonth) => {
  return ApiService.get(
    `/complianceCalendar/range?startMonth=${startMonth}&endMonth=${endMonth}`
  );
};

/*contact */
export const contact = (body) => {
  return ApiService.post(`/contact`, body);
};

/*Teams*/
export const createTeams = (body) => {
  return ApiService.post(`/teams`, body);
};

export const getTeamsByUserId = () => {
  return ApiService.get(`/teams/byUserId`);
};

export const getTeamsById = (teamId) => {
  return ApiService.get(`/teams/${teamId}`);
};

export const updateTeamName = (teamId, body) => {
  return ApiService.put(`/teams/${teamId}`, body);
};

export const deleteTeam = (teamId) => {
  return ApiService.delete(`/teams/${teamId}`);
};

export const Teaminvite = (body) => {
  return ApiService.post(`/teamMember/invite`, body);
};

export const getTeamsMembersByTeamId = (teamId) => {
  return ApiService.get(`/teamMember/${teamId}`);
};

export const acceptInvitation = (requestBody) => {
  return ApiService.post(`/teamMember`, requestBody);
};

/*business for sale  filter*/

export const searchfilter = (requestBody) => {
  return ApiService.post(`/companies/comprehensiveSearch`, requestBody);
};

// export const businessForSalefilter = (requestBody) => {
//   return ApiService.post(`/businessForSale?industry=Biscuits&location=Hyderbad`, requestBody);
// };

// export const businessForSalefilter = (requestBody) => {
//   let queryparams=new URLSearchParams(requestBody)
//   return ApiService.post(`/businessForSale?${queryparams.toString()}`);
// };

export const getbusinessForSale = () => {
  return ApiService.post(`/businessForSale/getBusinessForSale`);
};

export const businessForSalefilter = (requestBody) => {
  return ApiService.post(`/businessForSale/getBusinessForSale`, requestBody);
};

export const filterlocations = () => {
  return ApiService.get(`/businessForSale/locations`);
};
