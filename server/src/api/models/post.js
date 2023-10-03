import { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";
const Post = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    images: {
      type: [String],
      require: true,
    },
    acreage: {
      type: Number,
      require: true,
    },
    longitude: {
      type: Number,
      require: true,
    },
    latitude: {
      type: Number,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      require: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

Post.plugin(mongooseDelete, { overrideMethods: 'all' });
export default model("Post", Post);
