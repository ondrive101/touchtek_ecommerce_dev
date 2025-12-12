import mongoose from "mongoose";

const KanbanSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    color: String,
    series: Number,
    tasks:{
      type: Array,
      default: [],
    },
    data:{
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdByDepartment:{
      type: Object,
      default: {},
    },

  },
  { timestamps: true }
);

// Check if the model already exists before compiling it
const Kanban =
  mongoose.models.Kanban || mongoose.model("Kanban", KanbanSchema);

export default Kanban;
