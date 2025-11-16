const Sweet = require('../models/Sweet');



exports.createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    const sweet = new Sweet({ name, category, price, quantity });
    await sweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSweets = async (req, res) => {
  const sweets = await Sweet.find();
  res.json(sweets);
};

exports.searchSweets = async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  const filter = {};
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  const sweets = await Sweet.find(filter);
  res.json(sweets);
};

exports.updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSweet = async (req, res) => {
  const sweet = await Sweet.findByIdAndDelete(req.params.id);
  if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
  res.json({ message: 'Deleted' });
};

// Inventory routes
exports.purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const qty = Number(req.body.quantity) || 1;
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (sweet.quantity < qty) return res.status(400).json({ message: 'Insufficient stock' });
    sweet.quantity -= qty;
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const qty = Number(req.body.quantity) || 1;
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    sweet.quantity += qty;
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
