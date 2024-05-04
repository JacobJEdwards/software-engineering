import { API_ROUTE } from "../config";
import type { Result } from "./common.ts";
import type { Activity } from "../typings/user.ts";

export const getActivities = async (
  token: string,
): Promise<Result<Activity[]>> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/activity`, {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data: data.data.activities };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

export const createActivity = async (
  token: string,
  {
    activityTitle,
    activityType,
    activityDescription,
    hrsCompleted,
    tasks,
  }: {
    activityTitle: string;
    activityType: string;
    activityDescription: string;
    hrsCompleted: number;
    tasks: string[];
  },
): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/activity`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activityTitle,
        activityType,
        activityDescription,
        hrsCompleted,
        tasks,
      }),
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

export const deleteActivity = async (
  token: string,
  activityId: string,
): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/activity/`, {
      method: "DELETE",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activityId }),
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

const updateActivity = async (
  token: string,
  {
    activityTitle,
    activityType,
    notes,
    hrsCompleted,
  }: {
    activityTitle: string;
    activityType: string;
    notes: string;
    hrsCompleted: number;
  },
): Promise<Result> => {
  return {
    success: false,
    error: "Not yet implemented",
  };
};

export const ActivitiesService = {
  get: getActivities,
  create: createActivity,
  delete: deleteActivity,
  update: updateActivity,
};
