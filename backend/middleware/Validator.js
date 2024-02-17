import Joi from "joi"

const schema = Joi.object({
    Semester: Joi.string()
        .required(),
    ModuleCode: Joi.string()
        .alphanum()
        .min(3)
        .max(6)
        .required(),

    ModuleName: Joi.string()
        .min(3)
        .max(50)
        .required(),

    MilestoneTitle: Joi.string()
        .min(3)
        .max(50)
        .required(),

    MilestoneType: Joi.string()
        .valid('Coursework', 'Exam')
        .required(),

    Deadline: Joi.date()
        .iso()  // ensures the date is in ISO 8601 format
        .min('now')  // optional: ensures the deadline is not in the past
        .required()
});


class Validator {
    static async validateFile(row) {
        for (let ele of row) {
            await schema.validateAsync(ele);
        }
    }
}


export default Validator;