import { API_ROUTE } from "../config";
import { User } from "../typings/user";
import type { Result } from "./common";

export const getUser = async (token: string): Promise<Result<User>> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/home`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      return { success: false };
    }

    const { data } = await response.json();

    if (!data) {
      return { success: false };
    }

    return { success: true, data };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

export const uploadFile = async (
  token: string,
  file: File,
  isUpdate: boolean,
): Promise<Result> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const route = isUpdate
      ? `${API_ROUTE}/protected/upload?update=true`
      : `${API_ROUTE}/protected/upload`;

    const response = await fetch(route, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
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

export const generateCSV = async (
  data: {
    SemesterName: string;
    SemesterStartDate: Date;
    SemesterEndDate: Date;
    ModuleCode: string;
    ModuleName: string;
    ModuleStartDate: Date;
    ModuleEndDate: Date;
    MilestoneTitle: string;
    MilestoneType: string;
    MilestoneStartDate: Date;
    MilestoneEndDate: Date;
  }[],
  token: string,
): Promise<Result> => {
  try {
    const result = await fetch(`${API_ROUTE}/protected/generate-csv`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await result.json();

    if (!result.ok) {
      return { success: false, error: response.message };
    }

    return { success: true, data: response.data };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

export const UserService = {
  get: getUser,
  upload: uploadFile,
  generateCSV,
};
