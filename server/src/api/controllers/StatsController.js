import UserModel from "../models/user.js";
import PostModel from "../models/post.js";
import FollowModel from "../models/follow.js";
import { Types } from "mongoose";

const StatsController = {
  //[GET] /api/landlords/:id/stats?year=&month=&quarter...  => params { minPrice, maxPrice, minAcreage, maxAcreage, year, month, quarter } truyền trên đường dẫn
  getStatsOfPostByLandlord: async (req, res, next) => {
    try {
      const { year, month, quarter } = req.query;
      const query = {};
      if (year && !month && !quarter) {
        query.createdAt = {
          $gte: new Date(year, 0, 2),
          $lte: new Date(year, 12, 1),
        };
      }
      if (month) {
        query.createdAt = {
          $gte: new Date(year, month - 1, 2),
          $lte: new Date(year, month, 1),
        };
      } else if (quarter) {
        const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1;
        const quarterEndMonth = quarterStartMonth + 2;

        const quarterStartDate = new Date(year, quarterStartMonth - 1, 2);

        const quarterEndDate = new Date(year, quarterEndMonth, 1);

        query.createdAt = {
          $gte: quarterStartDate,
          $lte: quarterEndDate,
        };
      }
      const posts = await PostModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ["$userId", { $toObjectId: req.params.id }],
            },
            createdAt: query.createdAt,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            quantity: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
            },
            days: {
              $push: {
                day: "$_id.day",
                quantity: "$quantity",
              },
            },
            total: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            days: 1,
            total: 1,
          },
        },
        {
          $group: {
            _id: "$year",
            months: {
              $push: {
                month: "$month",
                days: "$days",
                total: "$total",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id",
            months: 1,
          },
        },
      ]);
      return res.status(200).json(posts);
    } catch (error) {
      return next(error);
    }
  },

  //[GET] /api/users/stats/ => { year, month, quarter }
  getStatsOfUser: async (req, res, next) => {
    try {
      const { year, month, quarter } = req.query;
      const query = {};
      if (year && !month && !quarter) {
        query.createdAt = {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 0),
        };
      }
      if (month) {
        query.createdAt = {
          $gte: new Date(year, month - 1, 0),
          $lte: new Date(year, month, 1),
        };
      } else if (quarter) {
        const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1;
        const quarterEndMonth = quarterStartMonth + 2;

        const quarterStartDate = new Date(year, quarterStartMonth - 1, 2);

        const quarterEndDate = new Date(year, quarterEndMonth, 1);

        query.createdAt = {
          $gte: quarterStartDate,
          $lte: quarterEndDate,
        };
      }
      const user = await UserModel.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            quantity: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
            },
            days: {
              $push: {
                day: "$_id.day",
                quantity: "$quantity",
              },
            },
            total: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            days: 1,
            total: 1,
          },
        },
        {
          $group: {
            _id: "$year",
            months: {
              $push: {
                month: "$month",
                days: "$days",
                total: "$total",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id",
            months: 1,
          },
        },
      ]);
      // const user = await UserModel.find(query);

      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },

  getStatsOfPost: async (req, res, next) => {
    try {
      const { year, month, quarter } = req.query;
      const query = {};
      if (year && !month && !quarter) {
        query.createdAt = {
          $gte: new Date(year, 0, 2),
          $lte: new Date(year, 12, 1),
        };
      }
      if (month) {
        query.createdAt = {
          $gte: new Date(year, month - 1, 2),
          $lte: new Date(year, month, 1),
        };
      } else if (quarter) {
        const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1;
        const quarterEndMonth = quarterStartMonth + 2;

        const quarterStartDate = new Date(year, quarterStartMonth - 1, 2);

        const quarterEndDate = new Date(year, quarterEndMonth, 1);

        query.createdAt = {
          $gte: quarterStartDate,
          $lte: quarterEndDate,
        };
      }
      const posts = await PostModel.aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            quantity: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
            },
            days: {
              $push: {
                day: "$_id.day",
                quantity: "$quantity",
              },
            },
            total: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            days: 1,
            total: 1,
          },
        },
        {
          $group: {
            _id: "$year",
            months: {
              $push: {
                month: "$month",
                days: "$days",
                total: "$total",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id",
            months: 1,
          },
        },
      ]);
      return res.status(200).json(posts);
    } catch (error) {
      return next(error);
    }
  }
};
export default StatsController;

// try {

// } catch (error) {
//   return next(error)
// }
