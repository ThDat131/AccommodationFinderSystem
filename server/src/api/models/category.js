import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";

const Category = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

Category.plugin(mongooseDelete,{ deletedAt : true, overrideMethods: 'all' })

export default model("Category", Category);
