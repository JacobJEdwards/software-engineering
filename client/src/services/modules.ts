import type { Result } from "./common.ts";
import type { Module } from "../typings/user.ts";
import { API_ROUTE } from "../config.ts";

const deleteModule = async (
  moduleId: string,
  token: string,
): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/module`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ moduleId }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.message };
    }

    return { success: true };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

const createModule = async (
  module: Module,
  token: string,
): Promise<Result<Module>> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/module`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(module),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data: data.data };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

const updateModule = async (
  module: Module & { moduleId: string },
  token: string,
): Promise<Result<Module>> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/module`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(module),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data: data.data };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

export const ModuleService = {
  delete: deleteModule,
  create: createModule,
  update: updateModule,
};
