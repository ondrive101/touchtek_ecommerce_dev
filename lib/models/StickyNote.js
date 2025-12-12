import mongoose from "mongoose";

const StickyNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      default: "Untitled Note"
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      default: "Click to edit this note and add your content..."
    },
    color: {
      type: String,
      required: true,
      enum: [
        "#fbbf24", // Sunny Yellow
        "#f472b6", // Rose Pink
        "#4ade80", // Mint Green
        "#60a5fa", // Ocean Blue
        "#a78bfa", // Lavender Purple
        "#fb923c"  // Coral Orange
      ],
      default: "#fbbf24"
    },
    createdByDepartment:{
        type: Object,
        default: {},
      },
 
    data: {
      type: Object,
      default: {}
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active"
    }
  },
  { 
    timestamps: true // This will automatically add createdAt and updatedAt
  }
);



// Check if the model already exists before compiling it
const StickyNote = 
  mongoose.models.StickyNote || mongoose.model("StickyNote", StickyNoteSchema);

export default StickyNote;
