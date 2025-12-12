import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: String,
    supplierId: String,
    email: String,
    contactNumber: String,
    alternativeContactNumber: String,
    supplierSeries: Number,
    employeeInformed: {
      type: Object,
      default: { isRefer: "No", referBy: "", referId: "" },
    },
    gender: String,
    type: String,
    category: String,
    subCategory: String,
    streetAddress: String,
    city: String,
    pincode: Number,
    country: String,
    state: String,
    billingAddressSame: {
      type: Boolean,
      default: false,
    },
    image: String,
    imagePublicId: String,
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
const Supplier =
  mongoose.models.Supplier || mongoose.model("Supplier", SupplierSchema);

export default Supplier;
