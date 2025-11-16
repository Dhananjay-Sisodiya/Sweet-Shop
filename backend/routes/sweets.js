const express = require('express');
const router = express.Router();
const sweets = require('../controllers/sweetsController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', auth, isAdmin, sweets.createSweet);
router.get('/', auth, sweets.getSweets);
router.get('/search', auth, sweets.searchSweets);
router.put('/:id', auth, isAdmin, sweets.updateSweet);
router.delete('/:id', auth, isAdmin, sweets.deleteSweet);

router.post('/:id/purchase', auth, sweets.purchaseSweet);
router.post('/:id/restock', auth, isAdmin, sweets.restockSweet);

module.exports = router;
