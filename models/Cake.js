const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the GridFS file ID
        required: true
    }
});

const Cake = mongoose.model('Cake', cakeSchema);
module.exports = Cake;
