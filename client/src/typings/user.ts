export type TaskStatus = "Started" | "In Progress" | "Completed";

export type Task = {
  _id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  hours: number;
  // activities
}

export type Milestone = {
  _id: string;
  milestoneTitle: string;
  milestoneType: string;
  milestoneProgress: number;
  ltsDefined: boolean;
  tasks: Array<Task>;
  startDate: Date;
  endDate: Date;
}

export type Module = {
  _id: string;
  moduleName: string;
  moduleCode: string;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
}

export type Semester = {
  _id: string;
  semesterName: string;
  modules: Array<Module>
  startDate: Date;
  endDate: Date;
}

export type User = {
  email: string;
  name: string;
  password?: string;
  auth?: boolean;
  semester: Array<Semester>;
}

export type unAuthedUser = {
  email: string;
  key: string;
}