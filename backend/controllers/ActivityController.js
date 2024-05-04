import Activity from "../service/ActivityService.js";

class ActivityController {
  static async getActivity(req, res) {
    let userid = req.userData.userId;
    if (userid) {
      let activity = await Activity.readAllUserActivities(userid);
      if (activity.code !== 200) {
        return res.status(activity.code).json(userid);
      }

      return res
        .status(200)
        .json({ message: activity.message, data: activity.data });
    }
  }

  static async createActivity(req, res) {
    let userid = req.userData.userId;
    let tasks = req.body.tasks;
    let activityName = req.body.activityTitle;
    let activityType = req.body.activityType;
    let activityDescription = req.body.activityDescription;
    let hrsCompleted = req.body.hrsCompleted;
    let activity = await Activity.createActivity(
      userid,
      tasks,
      activityName,
      activityType,
      activityDescription,
      hrsCompleted,
    );
    return res
      .status(activity.code)
      .json({ message: activity.message, data: activity.data });
  }

  static async deleteActivity(req, res) {
    let activityId = req.body.activityId;
    let activity = await Activity.deleteActivity(
      req.userData.userId,
      activityId,
    );
    return res
      .status(activity.code)
      .json({ message: activity.message, data: activity.data });
  }

  static async updateActivity(req, res) {
    const { activityId, activityTitle, activityType, notes, hrsCompleted } =
      req.body;
    const response = await Activity.updateActivity(
      req.userData.userId,
      activityId,
      activityTitle,
      activityType,
      notes,
      hrsCompleted,
    );
    return res
      .status(response.code)
      .json({ message: response.message, data: response.data });
  }
}

export default ActivityController;
