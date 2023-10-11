import FollowModel from "../models/follow.js";

const FollowsController = {
  //[POST] /api/follows/ => body {follower, following}
  follow: async (req, res, next) => {
    try {
      const { follower, following } = req.body;
      await FollowModel.create({ follower, following });
      return res.status(200).json({ message: "Follow Success" });
    } catch (error) {
      return next(error);
    }
  },

  //[DELETE] /api/follows/ => body {follower, following}
  unFollow: async (req, res, next) => {
    try {
      await FollowModel.deleteOne({
        follower: req.query.follower,
        following: req.query.following,
      });
      return res.status(204).json({ message: "Unfollow success" });
    } catch (error) {
      return next(error);
    }
  },

  //[GET] /api/follows/user/follower/:id => params follower
  getFollowByFollower: async (req, res, next) => {
    try {
      const follower = req.params.id;
      const follow = await FollowModel.find({ follower });
      if (!follow) {
        return res.status(404).json({message: "Follower not found"})
      }
      return res.status(200).json(follow);
    } catch (error) {
      return next(error);
    }
  },

  //[GET] /api/follows/user/following/:id => params following
  getFollowByFollowing: async (req, res, next) => {
    try {
      const following = req.params.id;
      const follow = await FollowModel.find({ following });

      if (!follow) {
        return res.status(404).json({message: "Following not found"})
      }
      
      return res.status(200).json(follow);
    } catch (error) {
      return next(error);
    }
  },
};

export default FollowsController;
