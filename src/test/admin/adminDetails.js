const adminModel = require('../../models/client/adminModel');

const adminDetails = async (req, res) => {
    try {
        const adminId = req.cookies.adminId;

        if (!adminId || adminId.trim() === "") {
            return res.status(400).json({ message: "Invalid admin ID" });
        }

        const admin = await adminModel.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        return res.status(200).json({
            success: true,
            data: admin,
            message: "Admin details retrieved successfully"
        });

    } catch (err) {
        console.error("Error fetching admin details:", err); // ✅ Logs error in server for debugging
        return res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: err.message 
        });
    }
}

module.exports = adminDetails;
