import { Schema, model } from "mongoose";

const Category = new Schema(
  {
    name: {
      type: String,
      require,
    },
    active: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
export default model("Category", Category);
