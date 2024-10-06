// orderModel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      cakeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cake",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryMethod: {
    type: String,
    enum: ["pickup", "delivery"],
    required: true,
  },
  location: {
    type: String,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
