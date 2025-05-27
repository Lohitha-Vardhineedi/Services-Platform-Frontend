import axios from "axios";
import Swal from "sweetalert2";

const ApiService = axios.create({
  baseURL: "https://prnv-services-production.up.railway.app",
});

const token = localStorage.getItem("adminToken");

if (token) {
  ApiService.defaults.headers.common["Authorization"] = ` ${token}`;
}
export const setAuthToken = (token) => {
  if (token) {
    ApiService.defaults.headers.common["Authorization"] = ` ${token}`;
  } else {
    delete ApiService.defaults.headers.common["Authorization"];
  }
};

// Add response to the Interceptor Service

export const addResponseInterceptor = (navigate) => {
  ApiService.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error);
      if (
        (error.response &&
          error.response.status === 401 &&
          error?.response?.data?.Message === "Invalid token") ||
        error?.response?.data?.error?.name === "Token empty" ||
        error?.response?.data?.error?.name === "Unauthorized User"
      ) {
        let timerInterval;
        let remainingTime = 5;
        Swal.fire({
          title: "Unauthorized",
          icon: "error",
          html: "Session Expired, will Navigate to Login Page in <b></b> sec.",
          timer: remainingTime * 1000,
          timerProgressBar: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getHtmlContainer().querySelector("b");
            timerInterval = setInterval(() => {
              if (timer) {
                timer.textContent = remainingTime--;
              }
            }, 1000);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          navigate("/login");
          localStorage.clear();
          if (result.dismiss === Swal.DismissReason.timer) {
            // Add any additional actions to perform after timer dismissal, if necessary
          }
        });
        return;
      }

      // Do something with response error
      return Promise.reject(error);
    }
  );
};

export default ApiService;
