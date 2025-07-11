const endpoints: any = {
  
   login: {
    method: "post",
    url: () => {
      return `/api/auth/login`;
    },
  },
  getAllCategories: {
    method: "get",
    url: () => {
      return `/api/categories/get`;
    },
  },
  getAvgReviews: {
    method: "get",
    url: (id: string) => {
      return `/api/reviews/${id}/stats`;
    },
  },
  

  register: {
    method: "post",
    url: () => `/api/auth/register`
  },


  getUserProfile: {
    method: "get",
    url: (userId: string) => `/api/userAuth/profile/${userId}`
  },

  updateUserProfile: {
    method: "put",
    url: (userId: string) => `/api/auth/profile/${userId}`
  },

  userRegister: {
    method: "post",
    url: () => `/api/userAuth/register`
  },
  technicianRegister: {
    method: "post",
    url: () => `/api/techAuth/register`
  },
  userLogin: {
    method: "post",
    url: () => `/api/userAuth/login`
  },
  technicianLogin: {
    method: "post",
    url: () => `/api/techAuth/login`
  },
  userGetProfile: {
    method: "get",
    url: (userId: string) => `/api/userAuth/profile/${userId}`
  },
  userEditProfile: {
    method: "put",
    url: () => `/api/userAuth/editProfile`
  },
  technicianGetProfileDetails: {
    method: "get",
    url: (userId: string) => `/api/techAuth/getTechProfile/${userId}`
  },
  technicianEditProfile: {
    method: "put",
    url: () => `/api/techAuth/editProfile`
  },
  getPlans: {
    method: "get",
    url: () => {
      return `/api/subscriptions/plans`;
    }
  },
  getTechImagesByTechId: { //images
    method: "get",
    url: (id: string) => `/api/techImages/getTechImagesByTechId/${id}`
  },
  getServicesByTechId: { // services - get
    method: "get",
    url: (id: string) => `/api/services/getServicesByTechId/${id}`
  },
  updateTechnicianControl: { // 
    method: "put",
    url: () => `/api/techAuth/updateTechnicianControl`
  },
  updateServiceControl: {
    method: "put",
    url: () => `/api/services/updateServiceControl`
  },
  createServiceControl: {
    method: "post",
    url: () => `/api/services/createServiceControl`
  },
  deleteServiceById: {
    method: "delete",
    url: (id: string) => `/api/services/deleteServiceById/${id}`
  },
  createTechImagesControl: {
    method: "post",
    url: () => `/api/techImages/createTechImagesControl`
  },
  getAllPincodes: {
    method: "get",
    url: () => `/api/pincodes/allAreas`
  }
}

export default endpoints;
