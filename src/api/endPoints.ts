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
  technicianGetProfile: {
    method: "get",
    url: (userId: string) => `/api/techAuth/profile/${userId}`
  },
  technicianEditProfile: {
    method: "post",
    url: () => `/api/techAuth/editProfile`
  },
  getPlans: {
    method: "get",
    url: () => {
      return `/api/subscriptions/plans`;
    }
  }
}

export default endpoints;
