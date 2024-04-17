export const TaskStatuses = {
  STARTED: "Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

export type TaskStatus = (typeof TaskStatuses)[keyof typeof TaskStatuses];

type Base = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Activity = {
  userId: string;
  tasks: Array<Task>;
  activityTitle: string;
  activityType: string;
  notes: string;
  hrsCompleted: number;
} & Base;

export type Task = {
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  status: TaskStatus;
  hrsCompleted: number;
  hrsRequired: number;
  activities: Array<Activity>;
} & Base;

export type Milestone = {
  milestoneTitle: string;
  milestoneType: string;
  milestoneProgress: number;
  ltsDefined: boolean;
  tasks: Array<Task>;
  startDate: Date;
  endDate: Date;
} & Base;

export type Module = {
  moduleName: string;
  moduleCode: string;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
} & Base;

export type Semester = {
  semesterName: string;
  modules: Array<Module>;
  startDate: Date;
  endDate: Date;
} & Base;

export type User = {
  email: string;
  name: string;
  password?: string;
  auth?: boolean;
  semester: Array<Semester>;
} & Base;

export type unAuthedUser = {
  email: string;
  key: string;
} & Base;

export type TaskForm = {
  title: string;
  milestoneId: string;
  startDate?: Date | string;
  endDate?: Date | string;
  progress: TaskStatus;
  hrsCompleted: number;
  hrsRequired: number;
};
