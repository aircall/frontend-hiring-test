import { useToast } from "@aircall/tractor";
import { NotificationVariants } from "@aircall/tractor/es/components/Notification";

export const useCustomToast = () => {
    const toast = useToast();
  
    const showToast = (arg0: { id: string; message: string; variant: NotificationVariants }) => {
      toast?.showToast(arg0);
    };
  
    const removeToast = (LOGIN_REJECTED: string) => {
      toast?.removeToast(LOGIN_REJECTED);
    };
  
    return { showToast, removeToast };
  };

