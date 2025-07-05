const endpoints = {
   id : 1,

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

export default endpoints;
