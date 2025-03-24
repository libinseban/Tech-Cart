const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.OWNER_PASSWORD,
  },
});

function sendCancellationEmail(userEmail, userName, orderId, productNames = [], orderAddress = {}, orderDate) {
  return {
    transporter,
    mailOptions: {
      from: `"Tech-Cart Support" <no-reply@tech-cart.com>`,
      to: userEmail,
      subject: `Your Order #${orderId} has been Cancelled`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h3 style="color: red;">Dear ${userName},</h3>
          <p>We regret to inform you that your order <strong>#${orderId}</strong> has been <span style="color: red;">cancelled</span> by the seller.</p>
          
          <h4 style="color: #333;">Cancelled Products:</h4>
          <ul style="list-style-type: disc; padding-left: 20px;">
            ${productNames.map((product) => `<li>${product}</li>`).join("") || "<li>No product details available.</li>"}
          </ul>

          <h4 style="color: #333;">Shipping Details:</h4>
          <p>
            <strong>Name:</strong> ${orderAddress?.name || "N/A"}<br>
            <strong>Address:</strong> ${orderAddress?.streetAddress || "N/A"}, ${orderAddress?.city || "N/A"}, ${orderAddress?.state || "N/A"} - ${orderAddress?.zipCode || "N/A"}<br>
            <strong>Contact Number:</strong> ${orderAddress?.phoneNumber || "N/A"}
          </p>
          
          <p><strong>Order Date:</strong> ${orderDate ? new Date(orderDate).toLocaleDateString() : "N/A"}</p>
          
          <p>We apologize for any inconvenience caused. If you have any questions, please contact our support team.</p>
          
          <p>Best regards,<br>
          <strong>Tech-Cart Support Team</strong></p>
        </div>`,
    },
  };
}

module.exports = sendCancellationEmail;
