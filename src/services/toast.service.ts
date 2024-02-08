import notify from "devextreme/ui/notify";

const showToast = async (
  status: "error" | "info" | "success" | "warning",
  text: string,
  timer: number = 3000
) => {
  notify(text, status, timer);
};

export const ToastService = {
  showToast: showToast,
};
