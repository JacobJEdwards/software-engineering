import Joi from "joi"

const fileSchema = Joi.object({
    SemesterName: Joi.string()
        .required()
        .min(3)
        .max(50),
    SemesterStartDate: Joi.date()
        .iso()
        .min(Date.now())
        .required(),
    SemesterEndDate: Joi.date()
        .iso()
        .min(Date.now())
        .required(),

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
        .min(Date.now())
        .required(),
    ModuleEndDate: Joi.date()
        .iso()
        .min(Joi.ref('ModuleStartDate'))
        .required(),

    // Milestone Validation
    MilestoneTitle: Joi.string()
        .min(3)
        .max(50)
        .required(),
    MilestoneType: Joi.string()
        .valid('Coursework', 'Exam')
        .required(),
    MilestoneStartDate: Joi.date()
        .iso()
        .min('now')
        .required(),
    MilestoneEndDate: Joi.date()
        .iso()
        .min('now')
        .required(),
});



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
        .min('now')
        .required(),
    SemesterEndDate: Joi.date()
        .iso()
        .min(Joi.ref('SemesterStartDate'))
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
        .min('now')
        .required(),
    ModuleEndDate: Joi.date()
        .iso()
        .min(Joi.ref('ModuleStartDate'))
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
        .min(Joi.ref('TaskStartDate'))
        .required(),
    Status: Joi.string()
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
        .required()


});


class Validator {
    static async validateFile(row) {
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
        try {
            semesterName != null ? "" : await fullSchema.validateAsync({ SemesterName: semesterName });
            semesterStartDate != null ? "" : await fullSchema.validateAsync({ SemesterStartDate: semesterStartDate });
            semesterEndDate != null ? "" : await fullSchema.validateAsync({ SemesterEndDate: semesterEndDate });
            return new Response("Semester object is valid", 200, {});

        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }


    static async validateModule(moduleObject) {
        try {
            await fullSchema.validateAsync(moduleObject);
            return new Response("Module object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }

    static async validateUser(userObject) {
        try {
            await fullSchema.validateAsync(userObject);
            return new Response("User object is valid", 200, {});
        }
        catch (e) {
            return new Response(e.message, 400, {});
        }
    }

    static async validateUser(userId, email, name, password) {
        try {
            await fullSchema.val({ UserId: userId }, UserId);

        } catch (e) {
            console.log(e.message)
        }
    }

    static async validateModule(moduleName, moduleCode, moduleStartDate, moduleEndDate) {
        try {
            moduleName != null ? await fullSchema.validateAsync({ ModuleName: moduleName }) : "";
            moduleCode != null ? await fullSchema.validateAsync({ ModuleCode: moduleCode }) : "";
            moduleStartDate != null ? await fullSchema.validateAsync({ ModuleStartDate: moduleStartDate }) : "";
            moduleEndDate != null ? await fullSchema.validateAsync({ ModuleEndDate: moduleEndDate }) : "";

            return new Response("Module object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }


    static async validateMilestone(milestoneObject) {
        try {
            await fullSchema.validateAsync(milestoneObject);
            return new Response("Milestone object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }

    static async validateMilestone(milestoneTitle, milestoneType, milestoneStartDate, milestoneEndDate) {
        try {
            milestoneTitle != null ? await fullSchema.validateAsync({ MilestoneTitle: milestoneTitle }) : "";
            milestoneType != null ? await fullSchema.validateAsync({ MilestoneType: milestoneType }) : "";
            milestoneStartDate != null ? await fullSchema.validateAsync({ MilestoneStartDate: milestoneStartDate }) : "";
            milestoneEndDate != null ? await fullSchema.validateAsync({ MilestoneEndDate: milestoneEndDate }) : "";

            return new Response("Milestone object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }

    static async validateTask(taskObject) {
        try {
            await fullSchema.validateAsync(taskObject);
            return new Response("Task object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }

    static async validateTask(taskTitle, taskStartDate, taskEndDate, status, hrsCompleted, hrsRequired, activities) {
        try {
            taskTitle != null ? await fullSchema.validateAsync({ TaskTitle: taskTitle }) : "";
            taskStartDate != null ? await fullSchema.validateAsync({ TaskStartDate: taskStartDate }) : "";
            taskEndDate != null ? await fullSchema.validateAsync({ TaskEndDate: taskEndDate }) : "";
            status != null ? await fullSchema.validateAsync({ Status: status }) : "";
            return new Response("Task object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }


    static async validateActivity(activityObject) {
        try {
            await fullSchema.validateAsync(activityObject);
            return new Response("Activity object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }

    static async validateActivity(activityUserId, tasksList, activityTitle, activityType, notes, hrsCompleted) {
        try {
            activityUserId != null ? "" : await fullSchema.validateAsync({ ActivityUserId: activityUserId });
            tasksList != null ? "" : await fullSchema.validateAsync({ TasksList: tasksList });
            activityTitle != null ? "" : await fullSchema.validateAsync({ ActivityTitle: activityTitle });
            activityType != null ? "" : await fullSchema.validateAsync({ ActivityType: activityType });
            notes != null ? "" : await fullSchema.validateAsync({ Notes: notes });
            hrsCompleted != null ? "" : await fullSchema.validateAsync({ hrsCompleted: hrsCompleted });
            return new Response("Activity object is valid", 200, {});
        } catch (e) {
            return new Response(e.message, 400, {});
        }
    }
}


export default Validator;
