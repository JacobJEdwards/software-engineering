import { API_ROUTE } from "../config.ts";
import type { Result } from "./common.ts";

export const login = async (
  email: string,
  password: string,
): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message,
      };
    }

    const { token } = data;

    if (!token) {
      return {
        success: false,
        error: data.message,
      };
    }

    return {
      success: true,
      data: token,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
};

export const signup = async (
  name: string,
  email: string,
  password: string,
): Promise<Result> => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
      }),
    };

    const response = await fetch(`${API_ROUTE}/auth/signup`, options);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message,
      };
    }

    const userId = data.data?.userId;

    if (!userId) {
      return {
        success: false,
        error: data.message,
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (e: unknown) {
    console.error(e);
    return {
      success: false,
    };
  }
};

export const AuthService = {
  login,
  signup,
};
