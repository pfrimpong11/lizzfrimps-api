const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Cake = require('../models/Cake');
const { ObjectId } = mongoose.Types; // Ensure you're importing ObjectId correctly

// Establish connection to MongoDB
let gridfsBucket;

const conn = mongoose.connection;

conn.once('open', () => {
    // Initialize GridFSBucket
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'photos'  // Use your bucket name
    });
});

// Upload cake with image (Admin)
exports.uploadCake = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Create a new Cake document in MongoDB
        const cake = new Cake({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            imageId: req.file.id  // Store GridFS file ID in the cake document
        });

        const savedCake = await cake.save();
        return res.status(201).json({ message: 'Cake uploaded successfully', cake: savedCake });
    } catch (error) {
        console.error("Error saving cake:", error);
        return res.status(500).json({ message: 'Error saving cake', error });
    }
};

// Fetch and serve the image from GridFS
exports.getImage = async (req, res) => {
    const imageId = req.params.id; // ID from route parameter

    try {
        // Create ObjectId from the passed ID
        const fileId = new ObjectId(imageId); // Use 'new' keyword here

        // Find the file in the database using GridFSBucket
        const file = await gridfsBucket.find({ _id: fileId }).toArray();

        // Check if the file exists
        if (!file.length) {
            return res.status(404).send({ message: 'File not found!' });
        }

        // Check if the file is an image
        const fileData = file[0];
        if (fileData.contentType === 'image/jpeg' || fileData.contentType === 'image/png') {
            const readStream = gridfsBucket.openDownloadStream(fileData._id);
            res.set('Content-Type', fileData.contentType);
            readStream.pipe(res);

            // Handle stream errors
            readStream.on('error', (err) => {
                res.status(500).json({ message: 'Error fetching image', error: err });
            });
        } else {
            res.status(404).json({ message: 'File is not an image' });
        }

    } catch (err) {
        console.error("Error during file retrieval:", err);
        return res.status(500).send({ message: err.message });
    }
};

// Delete cake and its associated image (Admin)
exports.deleteCake = async (req, res) => {
    try {
        const cake = await Cake.findById(req.params.id);
        if (!cake) return res.status(404).json({ message: 'Cake not found' });

        // Delete the image from GridFS
        await gridfsBucket.delete(cake.imageId); // Correctly use gridfsBucket to delete

        // Delete the cake document
        await Cake.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Cake and image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cake', error });
    }
};

// Fetch all cakes
exports.getCakes = async (req, res) => {
    try {
        const cakes = await Cake.find();
        res.status(200).json(cakes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cakes', error });
    }
};




// (Admin)
exports.editCake = async (req, res) => {
    const { id } = req.params; // Make sure this ID is being retrieved correctly
    const { name, category, price } = req.body;
  
    try {
      const updatedCake = await Cake.findByIdAndUpdate(
        id,
        { name, category, price },
        { new: true, runValidators: true }
      );
  
      if (!updatedCake) {
        return res.status(404).json({ message: 'Cake not found' });
      }
  
      res.status(200).json({ message: 'Cake updated successfully', cake: updatedCake });
    } catch (error) {
      console.error("Error updating cake:", error);
      return res.status(500).json({ message: 'Error updating cake', error });
    }
  };
  