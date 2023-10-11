import UserModel from "../models/user.js";
import PostModel from "../models/post.js";
import FollowModel from "../models/follow.js";

const StatsController = {
  //[GET] /api/landlords/:id/stats?year=&month=&quarter...  => params { minPrice, maxPrice, minAcreage, maxAcreage, year, month, quarter } truyền trên đường dẫn
  getStatsOfPost: async (req, res, next) => {
    try {
      const {
        minPrice,
        maxPrice,
        minAcreage,
        maxAcreage,
        year,
        month,
        quarter,
      } = req.query;
      const query = { userId: req.params.id };
      if (minPrice && maxPrice) {
        query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
      }

      if (minAcreage && maxAcreage) {
        query.acreage = { $gte: Number(minAcreage), $lte: Number(maxAcreage) };
      }

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
        // 1 2 3 4
        const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1; // [1, 4, 7, 10]
        const quarterEndMonth = quarterStartMonth + 2;

        // Tính ngày bắt đầu của quý
        // const quarterStartDate = new Date(year, quarterStartMonth - 1, 1);
        const quarterStartDate = new Date(year, quarterStartMonth - 1, 2);

        // Tính ngày kết thúc của quý
        // const quarterEndDate = new Date(year, quarterEndMonth - 1, 1);
        const quarterEndDate = new Date(year, quarterEndMonth, 1);

        // Sử dụng quarterStartDate và quarterEndDate trong truy vấn của bạn
        query.createdAt = {
          $gte: quarterStartDate, 
          $lte: quarterEndDate, 
        };
      }

      const posts = await PostModel.find(query);
      return res.status(200).json(posts);
    } catch (error) {
      return next(error);
    }
  },
  //[GET] /api/users/stats/ => { year, month, quarter }
  getStatsUser: async (req, res, next) => {
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
        // 1 2 3 4
        const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1; // [1, 4, 7, 10]
        const quarterEndMonth = quarterStartMonth + 2;

        // Tính ngày bắt đầu của quý
        // const quarterStartDate = new Date(year, quarterStartMonth - 1, 1);
        const quarterStartDate = new Date(year, quarterStartMonth - 1, 2);

        // Tính ngày kết thúc của quý
        // const quarterEndDate = new Date(year, quarterEndMonth - 1, 1);
        const quarterEndDate = new Date(year, quarterEndMonth, 1);

        // Sử dụng quarterStartDate và quarterEndDate trong truy vấn của bạn
        query.createdAt = {
          $gte: quarterStartDate, 
          $lte: quarterEndDate, 
        };
      }

      const user = await UserModel.find(query);

      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  },
};
export default StatsController;

// try {

// } catch (error) {
//   return next(error)
// }
