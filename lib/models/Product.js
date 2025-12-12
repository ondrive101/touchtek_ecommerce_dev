import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: String,
    category: String,
    subCategory: String,
    shortDescription: String,
    longDescription: String,
    image: {
      type: String,
      default: "",
    },
    data: Array,
    imagePublicId: {
      type: String,
      default: "",
    },
    skucode: String,
    productCode: Number,
    type: String,
    createdByDepartment:{
      type: Object,
      default: {},
    },
    approvals: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    createdByName: String,
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
