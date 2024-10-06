// controllers/cartController.js
const Cart = require('../models/cart');
const User = require('../models/user');

// Fetch cart items for the logged-in user
exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you are using middleware to get the user ID
    const cart = await Cart.findOne({ userId }).populate('items.cakeId'); // Populate cake details
    const itemCount = cart ? cart.items.reduce((count, item) => count + item.quantity, 0) : 0;

    res.status(200).json({ itemCount, items: cart ? cart.items : [] }); // Return total item count and cart items
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
  const { cakeId, quantity } = req.body;
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the item is already in the cart
    const existingItem = cart.items.find(item => item.cakeId.toString() === cakeId);
    if (existingItem) {
      existingItem.quantity += quantity; // Update quantity
    } else {
      cart.items.push({ cakeId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error adding item to cart' });
  }
};

// Update item quantity in cart
exports.updateItemInCart = async (req, res) => {
  const { cakeId, quantity } = req.body;
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const existingItem = cart.items.find(item => item.cakeId.toString() === cakeId);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    existingItem.quantity = quantity; // Update quantity
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating item in cart' });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    try {
      const userId = req.user.id; // Get the user ID
      const { itemId } = req.body; // Get the item ID to remove
  
      // Remove the item from the cart
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { _id: itemId } } }, // Use $pull to remove the item
        { new: true }
      ).populate('items.cakeId'); // Populate cake details
  
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      res.status(200).json({ itemCount: cart.items.length, items: cart.items });
    } catch (error) {
      res.status(500).json({ error: 'Error removing cart item' });
    }
  };
  


// Delete Cart Controller
exports.deleteCart = async (req, res) => {
    const userId = req.user.id; // Assuming you're using authentication middleware to attach user ID to the request

    try {
        // Find the user's cart and clear it
        const result = await Cart.findOneAndUpdate(
            { userId: userId },
            { items: [] }, // Clear items array
            { new: true } // Return the updated document
        );

        if (!result) {
            return res.status(404).json({ message: "Cart not found." });
        }

        res.status(200).json({ message: "Cart cleared successfully.", cart: result });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};