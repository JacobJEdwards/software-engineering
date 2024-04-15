
import Activity from '../service/ActivityService.js';

class ActivityController {
    static async getActivity(req, res) {
        let userid = req.userData.userId;
        if (userid) {
            let activity = await Activity.readAllUserActivities(userid);
            if (activity.code !== 200) {
                return res.status(activity.code).json(userid);
            }

            return res.status(200).json({ message: activity.message, data: activity.data });
        }
    }

    static async createActivity(req, res) {
        let userid = req.userData.userId;
        let moduleCode = req.body.moduleCode;
        let milestoneId = req.body.milestoneId;
        let tasks = req.body.tasks;
        let activityName = req.body.activityName;
        let activityType = req.body.activityType;
        let activityDescription = req.body.activityDescription;
        let activity = await Activity.createActivity(userid, moduleCode, milestoneId, tasks, activityName, activityType, activityDescription);
        return res.status(activity.code).json({ message: activity.message, data: activity.data });
    }

    static async deleteActivity(req, res) {
        let activityId = req.body.activityId;
        let activity = await Activity.deleteActivity(activityId);
        return res.status(activity.code).json({ message: activity.message, data: activity.data });
    }


}

export default ActivityController
