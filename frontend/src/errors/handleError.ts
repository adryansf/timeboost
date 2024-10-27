import { IApiError } from "@/services/api";
import { toast } from "react-toastify";

export const handleError = (e: Partial<IApiError> | any) => {
  try {
    if ("message" in e) {
      return toast.error(e.message);
    }
    return toast.error("Aconteceu um erro!");
  } catch (err) {
    return toast.error("Aconteceu um erro!");
  }
};
