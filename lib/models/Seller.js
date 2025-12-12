import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    sellerName: String,
    address: String,
    pincode: Number,
    state: String,
    sellerCode: Number,
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
const Seller =
  mongoose.models.Seller || mongoose.model("Seller", SellerSchema);

export default Seller;
