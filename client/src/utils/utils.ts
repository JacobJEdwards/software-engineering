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

export function useSuccessErrorMessage(): {
  success: Ref<string>;
  error: Ref<string>;
} {
  const success = ref<string>("");
  const error = ref<string>("");

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
