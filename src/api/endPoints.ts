const endpoints: any = {

    getAllCategories: {
    method: "get",
    url: () => {
      return `/api/categories/get`;
    },
  },

  login: {
    method: "post",
    url: () => "/api/auth/login"
  },

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