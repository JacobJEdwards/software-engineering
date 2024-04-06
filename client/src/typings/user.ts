export type TaskStatus = "Started" | "In Progress" | "Completed";

// TODO timestampes

type Base = {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Task = {
  name: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  hours: number;
  // TODO activities
} & Base

export type Milestone = {
  milestoneTitle: string;
  milestoneType: string;
  milestoneProgress: number;
  ltsDefined: boolean;
  tasks: Array<Task>;
  startDate: Date;
  endDate: Date;
} & Base

export type Module = {
  moduleName: string;
  moduleCode: string;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
} & Base

export type Semester = {
  semesterName: string;
  modules: Array<Module>
  startDate: Date;
  endDate: Date;
} & Base

export type User = {
  email: string;
  name: string;
  password?: string;
  auth?: boolean;
  semester: Array<Semester>;
} & Base

export type unAuthedUser = {
  email: string;
  key: string;
} & Base