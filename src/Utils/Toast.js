import { toast } from "react-toastify";
import swal from "sweetalert";
import Swal from "sweetalert2";

export const Success = (message) => {
  toast.success(`${message}`, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
export const ConfirmationDiaolog = (
  Message,
  buttonText,
  isConfirmed,
  props
) => {
  swal(Message, {
    icon: "warning",
    dangerMode: true,
    buttons: {
      // cancel: "Cancel",
      catch: {
        text: buttonText,
        value: "Complete",
      },
      defeat: false,
    },
  }).then((value) => {
    switch (value) {
      case "Complete":
        isConfirmed(props);
        break;
      default:
    }
    // default: break
  });
};

export const Error = (message) => {
  toast.error(`${message}`, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
export const Error_Dark = (message) => {
  toast.error(`${message}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const Success_Dark = (message) => {
  toast.success(`${message}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

// export const SuccessSwal = (message, SubMessage) => {
//   swal(message, SubMessage, "success");
// };

// export const warningSwal = (message, SubMessage) => {
//   swal(message, SubMessage, "warning");
// };

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const SuccessMessage = (title) => {
  Toast.fire({
    icon: "success",
    title: title,
  });
};

export const ErrorMessage = (title) => {
  Toast.fire({
    icon: "error",
    title: title,
  });
};
export const SuccessSwal = (title, message) => {
  Swal.fire(title, message, 'success');
};

export const warningSwal = (title, message) => {
  Swal.fire(title, message, 'warning');
};
