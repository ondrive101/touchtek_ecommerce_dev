import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    mailSetup: {
      type: Object,
      default: {},
    },
    officialEmail: {
      type: String,
      default: "",
    },
    data:{
      type: Object,
      default: {},
    },
    contactNumber: {
      type: String,
      default: "",
    },
    alternativeContactNumber: {
      type: String,
      default: "",
    },
    currentAddress: {
      type: String,
      default: "",
    },
    permanentAddress: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    dateOfJoining: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    employeeCode: {
      type: String,
      default: "",
    },
    emergencyContactPerson: {
      type: String,
      default: "",
    },
    emergencyContactRelation: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    empCode: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdByName: String,
    createdByDepartment:{
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const Employee = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

export default Employee;
