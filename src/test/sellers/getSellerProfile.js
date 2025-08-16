

const Seller = require("../../models/client/seller");

const SellerProfile = async (req, res) => {
  try {
    const sellerId = req.cookies.sellerId;

    if (!sellerId || sellerId.trim() === "") {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const fetchProfile = await Seller.findById(sellerId);

    if (!fetchProfile) {
      return res.status(404).json({ message: "Seller not found in DB" });
    }

    return res.status(200).json({ fetchProfile });

  } catch (error) {
    console.error("Error fetching seller profile:", error);
    return res.status(500).json({ message: "Internal server error", error: true });
  }
};

module.exports = SellerProfile;
