import type { Result } from "./common.ts";
import type { Milestone } from "../typings/user.ts";
import { API_ROUTE } from "../config.ts";

const deleteMilestone = async (
  milestoneId: string,
  token: string,
): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/milestone`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ milestoneId }),
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

const createMilestone = async (
  milestone: Milestone,
  token: string,
): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/milestone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(milestone),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

const updateMilestone = async (
  milestone: Milestone & { milestoneId: string },
  token: string,
): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/milestone`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(milestone),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message };
    }

    return { success: true };
  } catch (e: unknown) {
    console.error(e);
    return { success: false };
  }
};

export const MilestoneService = {
  delete: deleteMilestone,
  create: createMilestone,
  update: updateMilestone,
};
