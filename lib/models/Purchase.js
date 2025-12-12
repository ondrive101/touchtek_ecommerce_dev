import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    type: String,
    data: {
      type: Object,
      default: {},
    },
    orderCode: String,
    orderSeries: String,
    status: String,
    createdByDepartment:{
      type: Object,
      default: {},
    },
    approvals: {
      type: Object,
      default: {},
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
const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema);

export default Purchase;
