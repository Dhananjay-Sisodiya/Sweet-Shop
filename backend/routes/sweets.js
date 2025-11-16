const express = require('express');
const router = express.Router();
const sweets = require('../controllers/sweetsController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


router.post('/', auth, isAdmin, sweets.createSweet);          // Admin: create
router.get('/', auth, sweets.getSweets);                      // Protected
router.get('/search', auth, sweets.searchSweets);             // Protected
router.put('/:id', auth, isAdmin, sweets.updateSweet);        // Admin update
router.delete('/:id', auth, isAdmin, sweets.deleteSweet);     // Admin delete

// Inventory actions
router.post('/:id/purchase', auth, sweets.purchaseSweet);     // any authenticated user
router.post('/:id/restock', auth, isAdmin, sweets.restockSweet); // admin restock

module.exports = router;
