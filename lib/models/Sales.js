import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const Sales =
  mongoose.models.Sales || mongoose.model("Sales", SalesSchema);

export default Sales;
