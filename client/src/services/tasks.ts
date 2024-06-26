import { API_ROUTE } from "../config";
import { TaskForm, TaskStatuses } from "../typings/user.ts";
import type { Result } from "./common.ts";

const deleteTask = async (taskId: string, token: string): Promise<Result> => {
  try {
    const response = await fetch(`${API_ROUTE}/protected/task`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ taskId }),
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

const createTask = async (task: TaskForm, token: string): Promise<Result> => {
  try {
    const body = {
      milestoneId: task.milestoneId,
      tasktitle: task.title,
      startDate: task.startDate ?? new Date(),
      endDate: task.endDate ?? new Date(),
      progress:
        task.progress === TaskStatuses.NOT_STARTED ? "Started" : task.progress,
      dependantTasks: task.dependantTasks,
      hrsCompleted: task.hrsCompleted,
      hrsRequired: task.hrsRequired,
    };

    const response = await fetch(`${API_ROUTE}/protected/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
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

const updateTask = async (
  task: Omit<TaskForm, "milestoneId"> & { taskId: string },
  token: string,
): Promise<Result> => {
  try {
    const body = {
      taskId: task.taskId,
      title: task.title,
      startDate: task.startDate,
      endDate: task.endDate,
      progress:
        task.progress === TaskStatuses.NOT_STARTED ? "Started" : task.progress,
      dependantTasks: task.dependantTasks,
      hrsCompleted: task.hrsCompleted,
      hrsRequired: task.hrsRequired,
    };

    const response = await fetch(`${API_ROUTE}/protected/task`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
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

export const TaskService = {
  delete: deleteTask,
  create: createTask,
  update: updateTask,
};
