import { ref, Ref, inject } from "vue";
import { VueCookies } from "vue-cookies";

export const useLoading = (
  value: boolean = false,
): { loading: Ref<boolean> } => {
  const loading = ref<boolean>(value);
  return { loading };
};

export const useCookies = (): VueCookies | undefined => {
  return inject<VueCookies | undefined>("$cookies");
};

type Message = {
  message: string;
  show: boolean;
};

export function useSuccessErrorMessage(): {
  success: Ref<Message>;
  error: Ref<Message>;
} {
  const success = ref<Message>({ message: "", show: false });
  const error = ref<Message>({ message: "", show: false });

  return { success, error };
}

export function useSuccessMessage(): { success: Ref<string> } {
  const success = ref<string>("");

  return { success };
}

export function useErrorMessage(): { error: Ref<string> } {
  const error = ref<string>("");

  return { error };
}
