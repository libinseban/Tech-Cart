const adminModel = require('../../models/client/adminModel');
const jwt = require("jsonwebtoken");


const editAdmin = async (req, res) => {
    try {
        const adminId = req.cookies.adminId;

        if (!adminId) {
            return res.status(400).json({ message: "Invalid admin ID", error: true });
        }

        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ message: "Please fill out all fields", error: true });
        }

        const adminDetails = await adminModel.findById(adminId);
        if (!adminDetails) {
            return res.status(404).json({ message: "Admin not found", error: true });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Updating existing admin instead of creating a new one
        adminDetails.name = name;
        adminDetails.email = email;
        adminDetails.password = hashedPassword;

        const updatedAdmin = await adminDetails.save();

        const token = jwt.sign({ id: updatedAdmin._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });

        res.cookie('access_token', token, { httpOnly: true });

        return res.status(200).json({
            data: updatedAdmin,
            success: true,
            error: false,
            message: "Admin details updated successfully",
        });

    } catch (err) {
        console.error("Error updating admin:", err);
        return res.status(500).json({
            message: "Server error",
            error: err.message,
            success: false
        });
    }
};

module.exports = editAdmin;
