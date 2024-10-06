// models/cart.js
const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  cakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake', // Assuming you have a Cake model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [CartItemSchema],
});

module.exports = mongoose.model('Cart', CartSchema);
