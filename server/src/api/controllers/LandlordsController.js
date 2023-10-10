import LandlordModel from "../models/landlord.js";
import UserModel from "../models/user.js";

const LandlordsController = {
  create: async (req, res, next) => {
    try {
      const files = req.files;
      const paths = files?.map((file) => file.path);
      if (paths.length < 3) {
        res.status(400).send("Upload minimum 3 photos");
        return next(createError(400, "Upload minimum 3 photos"));
      }
      const { userId, personalId, address } = req.body;

      if (!personalId) {
        return res
          .status(400)
          .send("Personal identification number is invalid");
      }
      const landlord = await LandlordModel.create({
        personalId,
        address,
        active: 0,
        images: paths,
      });
      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { landlordId: landlord._id }
      );
      return res.status(201).json(landlord);
    } catch (error) {
      return next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { active } = req.body;
      const landlord = await LandlordModel.findOneAndUpdate(
        { _id: req.params.id },
        { active },
        { new: true }
      );
      await UserModel.findOneAndUpdate(
        {
          landlordId: req.params.id,
        },
        {
          role: "ROLE_LANDLORD",
        },
        { new: true }
      );
      if (!landlord) {
        return res.status(404).send("Landlord not found");
      }
      return res.status(200).json(landlord);
    } catch (error) {
      return next(error);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const active = req.query.active;
      const query = {};
      if (active) {
        query.active = { $eq: active };
      }

      const landlords = await LandlordModel.find(query);

      if (!landlords) {
        return res.status(404).json({ message: "Landlords not found" });
      }

      return res.status(200).json(landlords);
    } catch (error) {
      return next(error);
    }
  },
};

export default LandlordsController;
