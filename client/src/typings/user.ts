export type TaskStatus = "Started" | "In Progress" | "Completed";

export type Task = {
  name: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  notes: {
    date: Date;
    content: string
  };
}

export type Milestone = {
  name: string;

  milestoneType: string;
  tasks: Array<Task>;
  deadline: Date;
}

export type Module = {
  moduleName: string;
  moduleCode: string;
  milestones: Array<Milestone>;
  startDate: Date;
  endDate: Date;
}

export type Semester = {
  semesterName: string;
  modules: Array<Module>
}

export type User = {
  email: string;
  name: string;
  password?: string;
  semester: Array<Semester>;
}
