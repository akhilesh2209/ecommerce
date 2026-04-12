import Product from "../models/Product.js";

// GET ALL DEALS
export const getDeals = async (req, res, next) => {
  try {
    const now = new Date();
    
    // Get active deals (exclude expired ones)
    const deals = await Product.find({
      dealCategory: { $ne: null },
      $or: [
        { dealEndTime: null },
        { dealEndTime: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });

    // Group by deal category
    const groupedDeals = {
      flash: deals.filter(product => product.dealCategory === 'flash'),
      clearance: deals.filter(product => product.dealCategory === 'clearance'),
      weekly: deals.filter(product => product.dealCategory === 'weekly')
    };

    res.json({
      flash: groupedDeals.flash.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        timeLeft: product.dealEndTime ? getTimeLeft(product.dealEndTime) : null,
        dealEndTime: product.dealEndTime
      })),
      clearance: groupedDeals.clearance.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        timeLeft: null,
        dealEndTime: null
      })),
      weekly: groupedDeals.weekly.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        timeLeft: product.dealEndTime ? getTimeLeft(product.dealEndTime) : null,
        dealEndTime: product.dealEndTime
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate time left
function getTimeLeft(endTime) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
