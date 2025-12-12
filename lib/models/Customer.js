import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: String,
    customerId: String,
    customerSeries: Number,
    email: String,
    contactNumber: String,
    alternativeContactNumber: String,
    employeeInformed: {
      type: Object,
      default: { isRefer: "No", referBy: "", referId: "" },
    },
    gender: String,

    // Dates
    dateOfBirth: String,

    //Address
    streetAddress: String,
    city: String,
    pincode: String,
    country: String,
    state: String,
    billingAddressSame: Boolean,

    // Official Documents
    aadharCard: String,
    panCard: String,
    creditDurationLimit: String,
    creditLimit: String,

    // Customer Type
    customerCategory: String,
    distributorName: String,
    dealerName: String,
    customerType: String,

    // Image
    image: String,
    imagePublicId: String,
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
const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
