import Milestones from "../service/MilestoneService.js";

class MilestoneController {
    static async getMilestones(req, res) {
        if (req.query.from && req.query.to) {
            const milestone = await Milestones.milestoneFromToDate(
                req.userData.userId,
                req.query.from,
                req.query.to,
            );
            res.status(tasks.code).send({ message: milesotone.message, data: milestone.data });
        } else if (req.query.date) {
            const milestone = await Milestones.milestoneFromDate(
                req.userData.userId,
                req.query.date,
            );
            res.status(milestone.code).send({ message: milestone.message, data: milestone.data });
        } else if (req.query.moduleId) {
            const milestone = await Milestones.readMilestonesbyModuleId(userId, moduleId);
            res.status(milestone.code).send({ message: milestone.message, data: milestone.data });
        } else {
            const milestone = await milestone.readTaskByUserId(req.userData.userId);
            res.status(milestone.code).send({ message: milestone.message, data: milestone.data });
        }
    }

    static async createMilestone(req, res) {
        const milestone = await Milestone.createMilestoneByUserId(
            req.userData.userId,
            req.body.milestoneTitle,
            req.body.milestoneType,
            req.body.startDate,
            req.body.endDate,
            false);


        res.status(milestone.code).send({ message: milestone.message, data: milestone.data });
    }

    static async updateMilestone(req, res) {
        const milestone= await Milestone.updateMilestoneByUserId(
            req.userData.userId,
            req.body.milestoneTitle,
            req.body.milestoneType,
            req.body.startDate,
            req.body.endDate,
            false);
        res.status(milestone.code).send({ message: milestone.message, data: milestone.data });
    }

    static async deleteMilestone(req, res) {
        const tasks = await Milestone.deleteMilestoneByUserId(
            req.userData.userId,
            req.body.milestoneId,
        );
        res.status(tasks.code).send({ message: tasks.message, data: tasks.data });
    }
}

export default MilestoneController;
