import NotificationModel from "../models/notification.js";

const NotificationsController = {
  //[POST] /api/notifications/create/ => body { content, sender, receiver }
  create: async (req, res, next) => {
    try {
      const { content, sender, receiver } = req.body;
      const notify = await NotificationModel.create({ content, sender, receiver });
      return res.status(201).json(notify)
    } catch (error) {
      return next(error);
    }
  },

  //[GET] /api/notifications/:id => params
  getAllNotificationByReceiver: async (req, res, next) => {
    try {
      const notifications = await NotificationModel.find({
        receiver: req.params.id,
      });
      if (!notifications) {
        return res.status(404).send("Notifications not found");
      }
      return res.status(200).json(notifications);
    } catch (error) {
      return next(error);
    }
  },
};
export default NotificationsController;
