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
    // check this
    milestoneType: string;
}
