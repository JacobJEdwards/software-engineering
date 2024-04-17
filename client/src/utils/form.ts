type ValidationFunc = (value: string) => string | boolean;

export const nameRules: Array<ValidationFunc> = [
  (value: string) => {
    if (value.length > 6) return true;

    return "Username too short";
  },
];

export const emailRules: Array<ValidationFunc> = [
  (value: string) => {
    if (value.includes("@")) return true;

    return "Invalid email";
  },
];

export const passwordRules: Array<ValidationFunc> = [
  (value: string) => {
    if (value.length > 6) return true;

    return "Password too short";
  },
];

export const requiredRules: Array<ValidationFunc> = [
  (value: string) => {
    if (value.length > 0) return true;

    return "Field is required";
  },
];
