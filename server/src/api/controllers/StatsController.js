import UserModel from "../models/user.js";
import PostModel from "../models/post.js";
import FollowModel from "../models/follow.js";

const StatsController = {
  //[GET] /api/landlords/:id/stats?year=&month=&quarter...  => params { minPrice, maxPrice, minAcreage, maxAcreage, year, month, quarter } truyền trên đường dẫn
  getStatsOfPost: async (req, res, next) => {
    try {
      const { minPrice, maxPrice, minAcreage, maxAcreage, year, month, quarter } = req.query;
      const query = {userId: req.params.id}
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
          $gte: new Date(year, month - 1, 1),
          $lte: new Date(year, month, 0),
        };
      } else if (quarter) {
        const quarterStartMonth = (parseInt(quarter) - 1) * 3 + 1;
        const quarterEndMonth = quarterStartMonth + 2;
        query.createdAt = {
          $gte: new Date(year, quarterStartMonth, 1),
          $lte: new Date(year, quarterEndMonth, 0),
        };
      }

      const posts = await PostModel.find(query);
      return res.status(200).json(posts)
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
