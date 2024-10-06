const express = require('express');
const router = express.Router();
const cakeController = require('../controllers/cakeController');
const upload = require('../middleware/upload'); // Multer middleware for file uploads

// Route to upload a cake with image
router.post('/cakes/upload', upload.single('image'), cakeController.uploadCake);

// Route to fetch all cakes
router.get('/cakes', cakeController.getCakes);

// Route to get an image by its ID from GridFS
router.get('/cakes/image/:id', cakeController.getImage);

// Route to delete a cake and its associated image
router.delete('/cakes/:id', cakeController.deleteCake);

router.put('/cakes/edit/:id', cakeController.editCake);

module.exports = router;
