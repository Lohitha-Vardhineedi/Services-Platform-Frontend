const endpoints: any = {

   verifyLogin: {
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
    url: (id) => {
      return `/api/reviews/${id}/stats`;
    },
  },
  
};

  register: {
    method: "post",
    url: () => "/api/auth/register"
  },

  getUserProfile: {
    method: "get",
    url: (userId: string) => `/api/auth/profile/${userId}`
  },

  updateUserProfile: {
    method: "put",
    url: (userId: string) => `/api/auth/profile/${userId}`
  }
  
}

export default endpoints;
