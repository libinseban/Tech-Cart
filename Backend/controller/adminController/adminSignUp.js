const jwt = require('jsonwebtoken');
const adminModel = require("../../models/client/adminModel");
const bcrypt = require("bcryptjs");


const adminSignUpController = async (req, res) => {
    try {
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

        // Check if the admin already exists
        const existingAdmin = await adminModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            throw new Error("Admin already exists");
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create the admin
        const adminData = new adminModel({
            name: 'Libin Seban',
            email: adminEmail,
            password: hashedPassword,
            role: 'Admin'
        });
        const saveAdmin = await adminData.save();

        // Generate token
        const token = jwt.sign({ id: saveAdmin._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(200).json({
            data: saveAdmin,
            success: true,
            error: false,
            message: "Admin Created Successfully"
        });
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

module.exports = adminSignUpController;
