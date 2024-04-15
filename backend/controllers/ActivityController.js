
import Activity from '../service/ActivityService.js';

class ActivityController {
    static async getActivity(req, res) {
        let userid = req.userData.userId;
        let activity = await Activity.readAllUserActivities(userid);
        return res.status(activity.code).send(activity);
    }
}

export default ActivityController
