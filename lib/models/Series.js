import mongoose from "mongoose";

const SeriesSchema = new mongoose.Schema(
  {
    userSeries:{
      type: Number,
      default: 1,
    },
    empCode:{
      type: Number,
      default: 1,
    },
    board:{
      type: Number,
      default: 1,
    },
    productCode:{
      type: Number,
      default: 1000,
    },
    sellerCode:{
      type: Number,
      default: 1,
    },
    department:{
      type: Number,
      default: 1,
    },
    purchase:{
      type: Number,
      default: 1,
    },
    sales:{
      type: Number,
      default: 1,
    },
    customer:{
      type: Number,
      default: 1,
    },
    supplier:{
      type: Number,
      default: 1,
    },
    poid:{
      type: Number,
      default: 1,
    },
    soid:{
      type: Number,
      default: 1,
    },
    sroid:{
      type: Number,
      default: 1,
    },
    proid:{
      type: Number,
      default: 1,
    },

  },
  { timestamps: true }
);


// Check if the model already exists before compiling it
const Series = mongoose.models.Series || mongoose.model("Series", SeriesSchema);

export default Series;
