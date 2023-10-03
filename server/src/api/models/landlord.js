import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

const Landlord = new Schema(
  {
    personalId: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
Landlord.plugin(mongooseDelete, { overrideMethods: "all" });
export default model("Landlord", Landlord);
