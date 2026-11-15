const validateCreateProduct = (req, res, next) => {
  const { name, sku, category, price, quantity, supplier } = req.body;

  if (!name || !sku || !category || price === undefined || quantity === undefined || !supplier) {
    return res.status(400).json({
      message: 'Missing required fields: name, sku, category, price, quantity, and supplier are required'
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Price must be a non-negative number' });
  }

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ message: 'Quantity must be a non-negative number' });
  }

  next();
};

const validateStockAdjustment = (req, res, next) => {
  const { change } = req.body;

  if (typeof change !== 'number' || Number.isNaN(change) || change === 0) {
    return res.status(400).json({
      message: 'Please provide a valid non-zero numeric "change" value (positive to restock, negative for sale)'
    });
  }

  next();
};

module.exports = {
  validateCreateProduct,
  validateStockAdjustment
};