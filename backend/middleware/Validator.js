import Joi from "joi"
import Response from "../utils/Response.js"

const fullSchema = Joi.object({
    // user Validation
    UserId: Joi.string()
        .required(),
    Email: Joi.string()
        .email()
        .required(),
    Name: Joi.string()
        .required()
        .min(2)
        .max(50),
    Password: Joi.string()
        .required()
        .min(6)
        .max(50)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),


    // Semester Validation
    SemesterName: Joi.string()
        .required(),
    SemesterStartDate: Joi.date()
        .iso()
        .required(),
    SemesterEndDate: Joi.date()
        .iso()
        .min(Date.now())
        .required(),
    //
    // Module Validation
    ModuleName: Joi.string()
        .min(3)
        .max(50)
        .required(),
    ModuleCode: Joi.string()
        .alphanum()
        .min(3)
        .max(6)
        .required(),
    ModuleStartDate: Joi.date()
        .iso()
        .required(),
    ModuleEndDate: Joi.date()
        .iso()
        .min(Date.now())
        .required(),
    // Milestone Validation
    MilestoneTitle: Joi.string()
        .min(3)
        .max(50)
        .required(),
    MilestoneType: Joi.string()
        .required(),
    MilestoneProgress: Joi.number()
        .required(),
    LTSDefined: Joi.boolean()
        .required(),
    MilestoneStartDate: Joi.date()
        .iso()
        .required(),
    MilestoneEndDate: Joi.date()
        .iso()
        .required(),


    // Task Validation
    TaskTitle: Joi.string()
        .min(3)
        .max(50)
        .required(),
    TaskStartDate: Joi.date()
        .iso()
        .required(),
    TaskEndDate: Joi.date()
        .iso()
        .min(Date.now())
        .required(),
    Progress: Joi.string()
        .valid('Started', 'In Progress', 'Completed')
        .required(),
    hrsCompleted: Joi.number()
        .required(),
    hrsRequired: Joi.number()
        .required()
        .min(Joi.ref('hrsCompleted')),
    activites: Joi.array()
        .items(Joi.string())
        .required(),


    //Activity Validation
    ActivityUserId: Joi.string()
        .required()
        .alphanum()
        .min(3)
        .max(50),
    TasksList: Joi.array()
        .items(Joi.string())
        .required(),
    ActivityTitle: Joi.string()
        .min(3)
        .max(50)
        .required(),
    ActivityType: Joi.string()
        .min(3)
        .max(50)
        .required(),
    Notes: Joi.string(),
    hrsCompleted: Joi.number()
});

class Validator {
    static generateFileValidation() {
        const fileSchema = Joi.object({
            SemesterName: fullSchema.extract('SemesterName'),
            SemesterStartDate: fullSchema.extract('SemesterStartDate'),
            SemesterEndDate: fullSchema.extract('SemesterEndDate'),
            ModuleName: fullSchema.extract('ModuleName'),
            ModuleCode: fullSchema.extract('ModuleCode'),
            ModuleStartDate: fullSchema.extract('ModuleStartDate'),
            ModuleEndDate: fullSchema.extract('ModuleEndDate'),
            MilestoneTitle: fullSchema.extract('MilestoneTitle'),
            MilestoneType: fullSchema.extract('MilestoneType'),
            MilestoneStartDate: fullSchema.extract('MilestoneStartDate'),
            MilestoneEndDate: fullSchema.extract('MilestoneEndDate')
        });

        // Combine into a new fileSchema

        return fileSchema;
    }

    static async validateFile(row) {
        const fileSchema = Validator.generateFileValidation();
        for (let ele of row) {
            await fileSchema.validateAsync(ele);
        }
    }


    static async valdiateSemester(semesterObject) {
        try {
            await fullSchema.validateAsync(semesterObject);
            return new Response("Semester object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }


    static async validateSemester(semesterName, semesterStartDate, semesterEndDate) {
        if (semesterName !== null) {
            const name = fullSchema.extract('SemesterName');
            const { error } = name.validate(semesterName);
            if (error) {
                return new Response(error.message, 400, {});
            }
        }

        if (semesterStartDate !== null) {
            const startDate = fullSchema.extract('SemesterStartDate');
            const { error } = startDate.validate(semesterStartDate);
            if (error) {
                return new Response(error.message, 400, {});
            }
        }
        if (semesterEndDate !== null) {
            const endDate = fullSchema.extract('SemesterEndDate');
            const { error } = endDate.validate(semesterEndDate);
            if (error) {
                return new Response(error.message, 400, {});
            }
        }
        return new Response("Semester object is valid", 200, {});


    }


    static async validateModule(moduleObject) {
        const { error } = await fullSchema.validateAsync(moduleObject);
        if (error) {
            return new Response(error.message, 400, {});
        } else {
            return new Response("Module object is valid", 200, {});
        }
    }


    static async validateUserObject(userObject) {
        const { error } = await fullSchema.validateAsync(userObject);
        if (error) {
            return new Response(error.message, 400, {});
        } else {
            return new Response("User object is valid", 200, {});
        }
    }

    static async validateUser(userId, email, name, password) {
        let errors = [];
        if (userId !== null) {
            const id = fullSchema.extract('UserId');
            const { error } = await id.validateAsync(userId);
            if (error) {
                errors.push({ userId: error.message })
            }
        }

        if (email !== null) {
            const email = fullSchema.extract('Email');
            const { error } = email.validate(email);
            if (error) {
                errors.push({ email: error.message })
            }
        }

        if (name !== null) {
            const name = fullSchema.extract('Name');
            const { error } = name.validate(name);
            if (error) {
                errors.push({ name: error.message });
            }
        }

        if (password !== null) {
            const password = fullSchema.extract('Password');
            const { error } = password.validate(password);
            if (error) {
                errors.push({ password: error.message });
            }
        }

        if (errors.length > 0) {
            return new Response(errors.join(", "), 400, {});
        } else {
            return new Response("User object is valid", 200, {});
        }
    }

    static async validateModule(moduleName, moduleCode, moduleStartDate, moduleEndDate) {
        let errors = [];
        if (moduleName !== null) {
            const name = fullSchema.extract('ModuleName');
            const { error } = name.validate(moduleName);
            if (error) {
                errors.push(error.message);
            }
        }


        if (moduleCode !== null) {
            const code = fullSchema.extract('ModuleCode');
            const { error } = code.validate(moduleCode);
            if (error) {
                errors.push(error.message);
            }
        }

        if (moduleStartDate !== null) {
            const startDate = fullSchema.extract('ModuleStartDate');
            const { error } = startDate.validate(moduleStartDate);
            if (error) {
                errors.push(error.message);
            }
        }


        if (moduleEndDate !== null) {
            const endDate = fullSchema.extract('ModuleEndDate');
            const { error } = endDate.validate(moduleEndDate);
            if (error) {
                errors.push(error.message);
            }
        }

        if (errors.length > 0) {
            return new Response(errors.join(", "), 400, {});
        } else {
            return new Response("Module object is valid", 200, {});
        }

    }


    static async validateMilestone(milestoneObject) {
        const { error } = await fullSchema.validateAsync({ milestoneObject });
        if (error) {
            return new Response(error.message, 400, {});
        } else {
            return new Response("Milestone object is valid", 200, {});
        }
    }

    static async validateMilestone(milestoneTitle, milestoneType, milestoneStartDate, milestoneEndDate) {
        let errors = [];
        if (milestoneTitle !== null) {
            const title = fullSchema.extract('MilestoneTitle');
            const { error } = title.validate(milestoneTitle);
            if (error) {
                errors.push(error.message);
            }
        }
        if (milestoneType !== null) {
            const type = fullSchema.extract('MilestoneType');
            const { error } = type.validate(milestoneType);
            if (error) {
                errors.push(error.message);
            }
        }

        if (milestoneStartDate !== null) {
            const startDate = fullSchema.extract('MilestoneStartDate');
            const { error } = startDate.validate(milestoneStartDate);
            if (error) {
                errors.push(error.message);
            }
        }
        if (milestoneEndDate !== null) {
            const endDate = fullSchema.extract('MilestoneEndDate');
            const { error } = endDate.validate(milestoneEndDate);
            if (error) {
                errors.push(error.message);
            }
        }
        if (errors.length > 0) {
            return new Response(errors.join(", "), 400, {});
        }
        else {
            return new Response("Milestone object is valid", 200, {});

        }
    }

    static async validateTaskObject(taskObject) {
        const taskTitle = fullSchema.extract('TaskTitle');
        const startDate = fullSchema.extract('TaskStartDate');
        const endDate = fullSchema.extract('TaskEndDate');
        const progress = fullSchema.extract('Progress');
        const hrsCompleted = fullSchema.extract('hrsCompleted');
        const hrsRequired = fullSchema.extract('hrsRequired');
        const activities = fullSchema.extract('actvities');

        const taskSchema = Joi.object({
            title: taskTitle,
            startDate: startDate,
            endDate: endDate,
            status: progress,
            hrsCompleted: hrsCompleted,
            hrsRequired: hrsRequired,
            activities: activities
        });

        const { error } = taskSchema.validate(taskObject);


        if (error) {
            return new Response(error.message, 400, {});
        } else {
            return new Response("Task object is valid", 200, {});
        }
    }

    static async validateTask(taskTitle, taskStartDate, taskEndDate, taskProgress, hrsCompleted, hrsRequired, activities) {
        let errors = [];

        if (taskTitle !== null) {
            const title = fullSchema.extract('TaskTitle');
            const { error } = title.validate(taskTitle);
            if (error) {
                errors.push({ taskTitle: error.message });
            }
        }
        if (taskStartDate !== null) {
            const startDate = fullSchema.extract('TaskStartDate');
            const { error } = startDate.validate(taskStartDate);
            if (error) {
                errors.push({ startDate: error.message });
            }
        }
        if (taskEndDate !== null) {
            const endDate = fullSchema.extract('TaskEndDate');
            const { error } = endDate.validate(taskEndDate);
            if (error) {
                errors.push({ endDate: error.message });
            }
        }

        if (taskProgress !== null) {
            const progress = fullSchema.extract('Progress');
            const { error } = progress.validate(taskProgress);
            if (error) {
                errors.push({ taskProgress: error.message });
            }
        }
        if (hrsCompleted !== null) {
            const hrs = fullSchema.extract('hrsCompleted');
            const { error } = hrs.validate(hrsCompleted);
            if (error) {
                errors.push({ hrsCompleted: error.message });
            }
        }

        if (hrsRequired !== null) {
            const hrs = fullSchema.extract('hrsRequired');
            const { error } = hrs.validate(hrsRequired);
            if (error) {
                errors.push({ hrsrequired: error.message });
            }
        }

        if (activities !== null) {
            const activities = fullSchema.extract('activities');
            const { error } = activities.validate(activities);
            if (error) {
                errors.push({ activites: error.message });
            }
        }

        if (errors.length > 0) {
            return new Response("Errors", 400, errors);
        } else {
            return new Response("Task object is valid", 200, {});
        }
    }


    static async validateActivityObject(activityObject) {
        const activityUserId = fullSchema.extract('ActivityUserId');
        const tasksList = fullSchema.extract('TasksList');
        const activityTitle = fullSchema.extract('ActivityTitle');
        const activityType = fullSchema.extract('ActivityType');
        const notes = fullSchema.extract('Notes');
        const hrsCompleted = fullSchema.extract('hrsCompleted');

        const schema = Joi.object({
            userId: activityUserId,
            tasks: tasksList,
            activityTitle: activityTitle,
            activityType: activityType,
            notes: notes,
            hrsCompleted: hrsCompleted,
            completed: Joi.boolean()
        });

        const { error } = schema.validate(activityObject);
        if (error) {
            return new Response(error.message, 400, {});
        } else {
            return new Response("Activity object is valid", 200, {});
        }
    }

    static async validateActivity(activityUserId, tasksList, activityTitle, activityType, notes, hrsCompleted) {
        let errors = [];
        if (activityUserId !== null) {
            const userId = fullSchema.extract('ActivityUserId');
            const { error } = userId.validate(activityUserId);
            if (error) {
                errors.push(error.message);
            }
        }
        if (tasksList !== null) {
            const tasks = fullSchema.extract('TasksList');
            const { error } = tasks.validate(tasksList);
            if (error) {
                errors.push(error.message);
            }
        }
        if (activityTitle !== null) {
            const title = fullSchema.extract('ActivityTitle');
            const { error } = title.validate(activityTitle);
            if (error) {
                errors.push(error.message);
            }
        }
        if (activityType !== null) {
            const type = fullSchema.extract('ActivityType');
            const { error } = type.validate(activityType);
            if (error) {
                errors.push(error.message);
            }
        }
        if (notes !== null) {
            const note = fullSchema.extract('Notes');
            const { error } = note.validate(notes);
            if (error) {
                errors.push(error.message);
            }
        }

        if (hrsCompleted !== null) {
            const hrs = fullSchema.extract('hrsCompleted');
            const { error } = hrs.validate(hrsCompleted);
            if (error) {
                errors.push(error.message);
            }
        }

        if (errors.length > 0) {
            return new Response(errors.join(", "), 400, {});
        }
    }
}


export default Validator;
