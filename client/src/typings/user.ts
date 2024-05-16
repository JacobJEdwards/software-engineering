export const TaskStatuses = {
  // STARTED: "Started",
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

export type TaskStatus = (typeof TaskStatuses)[keyof typeof TaskStatuses];

export const MilestoneTypes = {
  ASSIGNMENT: "Assignment",
  EXAM: "Exam",
  PROJECT: "Project",
  QUIZ: "Quiz",
  TEST: "Test",
  COURSEWORK: "Coursework",
  PRESENTATION: "Presentation",
  OTHER: "Other",
} as const;

export type MilestoneType =
  (typeof MilestoneTypes)[keyof typeof MilestoneTypes];

export const ActivityTypes = {
  LECTURE: "Lecture",
  PRACTICAL: "Practical",
  TUTORIAL: "Tutorial",
  WORKSHOP: "Workshop",
  SEMINAR: "Seminar",
  READING: "Reading",
  STUDY: "Study",
} as const;

export type ActivityType = (typeof ActivityTypes)[keyof typeof ActivityTypes];

type Base = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Activity = {
  userId: string;
  tasks: Array<string>; // task ids
  activityTitle: string;
  activityType: ActivityType;
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
  dependantTasks: Array<string>;
  activities: Array<string>;
} & Base;

export type Milestone = {
  milestoneTitle: string;
  milestoneType: string;
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
  dependantTasks: Array<string>;
  hrsCompleted: number;
  hrsRequired: number;
};

export type ActivityForm = {
  activityTitle: string;
  activityType: string;
  activityDescription: string;
  hrsCompleted: number;
  tasks: string[];
};
