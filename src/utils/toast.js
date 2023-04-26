import { useToast } from "vue-toast-notification";

const toastSetting = {
  position: "top-right",
  duration: 3000,
};

const $toast = useToast();

const errorToast = (text) => {
  $toast.error(`some troubles - ${text}!`, toastSetting);
};

const successToast = (text) => {
  $toast.success(`${text}`, toastSetting);
};

const infoToast = (text) => {
  $toast.info(`${text}`, toastSetting);
};

export default {
  error: errorToast,
  success: successToast,
  info: infoToast,
};
