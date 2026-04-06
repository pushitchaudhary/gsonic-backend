import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    image: [
      {
        public_id: String,
        url: String,
      },
    ],
    specs: {
      type: Map,
      of: {
        type: String,
        trim: true,
      },
      default: {},
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
