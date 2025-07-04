const endpoints = {

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
}

export default endpoints;