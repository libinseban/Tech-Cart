const Seller = require("../../models/client/seller");
const bcrypt = require("bcryptjs");

const editSellerProfile = async (req, res) => {
  try {
    const { name, email, password, address, phoneNumber } = req.body;

    if (!name || !email || !password || !address || !phoneNumber) {
      return res.status(400).json({ message: "Please fill out all fields", error: true });
    }

    const findSeller = await Seller.findOne({ email });

    if (!findSeller) {
      return res.status(404).json({ message: "Seller not found", error: true });
    }

    const isPasswordMatch = await bcrypt.compare(password, findSeller.hashPassword);
    if (isPasswordMatch) {
      return res.status(409).json({
        message: "Password must be different from the old one",
        error: true,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedSeller = await Seller.findByIdAndUpdate(
      findSeller._id,
      {
        name,
        email,
        hashPassword: hashedPassword,
        address,
        phoneNumber,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedSeller,
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Internal server error", error: true });
  }
};

module.exports = editSellerProfile;
