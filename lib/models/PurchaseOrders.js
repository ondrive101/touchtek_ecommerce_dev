import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema(
  {
    poid: Number,
    subTotal: Number,
    items: {
      type: Array,
      default: [],
    },
    seller: {
        type: Object,
        default: {},
      },
    status: String,
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
const PurchaseOrder =
  mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrder;
