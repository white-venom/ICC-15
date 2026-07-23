import nodemailer from "nodemailer";

// Load configuration from env, fallback to mock logs if missing
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "info@inkandcottonclub.com";

const isSMTPConfigured = SMTP_HOST && SMTP_USER && SMTP_PASS;

export async function sendOrderEmails(order: any, userDetails: any) {
  const items = JSON.parse(order.items || "[]");
  
  // Format items text for emails
  const itemsHtml = items.map((it: any) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px; font-family: sans-serif; font-size: 14px; color: #333;">${it.name} (${it.colorName})</td>
      <td style="padding: 10px; font-family: sans-serif; font-size: 14px; color: #333; text-align: center;">${it.quantity}</td>
      <td style="padding: 10px; font-family: sans-serif; font-size: 14px; color: #333; text-align: right;">$${(it.price * it.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  const emailSubjectUser = `Your Invoice - Ink & Cotton Club Order ${order.trackingNumber}`;
  const emailSubjectAdmin = `NEW BESPOKE ORDER RECEIVED - Order ${order.trackingNumber}`;

  // USER EMAIL HTML (Clean, luxury minimalist receipt style)
  const userHtmlContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; font-family: Garamond, Georgia, serif; background: #fafafa; color: #111;">
      <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="font-weight: 300; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; font-size: 24px;">Ink & Cotton Club</h1>
        <p style="font-style: italic; font-size: 12px; margin: 5px 0 0 0; color: #d4af37;">Tailored Essentials</p>
      </div>

      <p style="font-size: 16px; line-height: 1.6;">Dear ${order.customerName || "Member"},</p>
      <p style="font-size: 15px; line-height: 1.6;">Thank you for your bespoke couture order. Your order is currently being handcrafted at our atelier.</p>

      <div style="background: #ffffff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f0f0f0;">
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td style="color: #666; font-family: sans-serif; font-weight: bold; width: 45%;">Tracking ID:</td>
            <td style="font-family: monospace; font-size: 14px; color: #111; font-weight: bold;">${order.trackingNumber}</td>
          </tr>
          <tr>
            <td style="color: #666; font-family: sans-serif; font-weight: bold; padding-top: 8px;">Shipping Address:</td>
            <td style="color: #333; padding-top: 8px;">${order.shippingAddress}</td>
          </tr>
          <tr>
            <td style="color: #666; font-family: sans-serif; font-weight: bold; padding-top: 8px;">Payment Mode:</td>
            <td style="color: #333; padding-top: 8px; text-transform: uppercase;">${order.paymentMethod}</td>
          </tr>
        </table>
      </div>

      <h3 style="text-transform: uppercase; font-size: 14px; letter-spacing: 0.1em; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f7f7f7;">
            <th style="padding: 10px; text-align: left; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #666;">Product Details</th>
            <th style="padding: 10px; text-align: center; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #666; width: 15%;">Qty</th>
            <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #666; width: 25%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 15px 10px; font-weight: bold; font-size: 15px; border-top: 2px solid #d4af37;">Grand Total:</td>
            <td style="padding: 15px 10px; font-weight: bold; font-size: 16px; text-align: right; color: #d4af37; border-top: 2px solid #d4af37;">$${order.totalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: center; font-size: 11px; color: #777; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;">
        <p>This is an automated receipt for your purchase. Please contact info@inkandcottonclub.com for help.</p>
        <p>&copy; ${new Date().getFullYear()} Ink & Cotton Club. All rights reserved.</p>
      </div>
    </div>
  `;

  // ADMIN EMAIL HTML (Contains comprehensive user info, address, phone, and order details)
  const adminHtmlContent = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #444; font-family: sans-serif; background: #111; color: #fff;">
      <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="color: #d4af37; font-weight: 300; letter-spacing: 0.1em; text-transform: uppercase; margin: 0; font-size: 20px;">Atelier Admin Dashboard</h1>
        <p style="font-size: 11px; margin: 5px 0 0 0; color: #888;">New Order Notification</p>
      </div>

      <h2 style="font-size: 16px; color: #d4af37; border-bottom: 1px solid #333; padding-bottom: 8px; text-transform: uppercase; margin-bottom: 15px;">Order Summary</h2>
      <table style="width: 100%; font-size: 13px; color: #ddd; margin-bottom: 20px;">
        <tr>
          <td style="color: #888; font-weight: bold; width: 35%; padding: 4px 0;">Tracking Number:</td>
          <td style="font-family: monospace; color: #fff; font-size: 14px; font-weight: bold;">${order.trackingNumber}</td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Payment Method:</td>
          <td style="text-transform: uppercase;">${order.paymentMethod}</td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Total Amount:</td>
          <td style="color: #d4af37; font-size: 15px; font-weight: bold;">$${order.totalPrice.toFixed(2)}</td>
        </tr>
      </table>

      <h2 style="font-size: 16px; color: #d4af37; border-bottom: 1px solid #333; padding-bottom: 8px; text-transform: uppercase; margin-bottom: 15px;">Customer Profile Details</h2>
      <table style="width: 100%; font-size: 13px; color: #ddd; margin-bottom: 20px;">
        <tr>
          <td style="color: #888; font-weight: bold; width: 35%; padding: 4px 0;">Name:</td>
          <td style="color: #fff; font-weight: bold;">${order.customerName || "N/A"}</td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Email:</td>
          <td>${order.contactEmail || "N/A"}</td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Phone:</td>
          <td>${order.contactPhone || "N/A"}</td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Shipping Address:</td>
          <td>${order.shippingAddress || "N/A"}</td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Pincode/ZIP:</td>
          <td style="font-family: monospace;">${order.pincode || "N/A"}</td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Membership Level:</td>
          <td><span style="background: #333; color: #d4af37; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${userDetails?.tier || "Guest"}</span></td>
        </tr>
        <tr>
          <td style="color: #888; font-weight: bold; padding: 4px 0;">Assigned Card:</td>
          <td style="font-family: monospace;">${userDetails?.cardNumber || "None"}</td>
        </tr>
      </table>

      <h2 style="font-size: 16px; color: #d4af37; border-bottom: 1px solid #333; padding-bottom: 8px; text-transform: uppercase; margin-bottom: 15px;">Products Requested</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #222;">
            <th style="padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; color: #888;">Item Description</th>
            <th style="padding: 8px; text-align: center; font-size: 11px; text-transform: uppercase; color: #888; width: 15%;">Qty</th>
            <th style="padding: 8px; text-align: right; font-size: 11px; text-transform: uppercase; color: #888; width: 25%;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((it: any) => `
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 8px; font-size: 13px; color: #eee;">
                <strong>${it.name}</strong><br/>
                <span style="font-size: 11px; color: #888;">Color: ${it.colorName}</span>
              </td>
              <td style="padding: 8px; font-size: 13px; color: #eee; text-align: center;">${it.quantity}</td>
              <td style="padding: 8px; font-size: 13px; color: #d4af37; text-align: right;">$${(it.price * it.quantity).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="text-align: center; font-size: 11px; color: #888; border-top: 1px solid #333; padding-top: 15px; margin-top: 30px;">
        <p>This is a system alert. To fulfill this order, please visit the Atelier Admin Panel.</p>
      </div>
    </div>
  `;

  if (isSMTPConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS
        }
      });

      // Send to User
      if (order.contactEmail) {
        await transporter.sendMail({
          from: `"Ink & Cotton Club" <${SMTP_USER}>`,
          to: order.contactEmail,
          subject: emailSubjectUser,
          html: userHtmlContent
        });
      }

      // Send to Admin
      await transporter.sendMail({
        from: `"ICC System Alerts" <${SMTP_USER}>`,
        to: ADMIN_EMAIL,
        subject: emailSubjectAdmin,
        html: adminHtmlContent
      });

      console.log(`[SMTP] Emails successfully dispatched to ${order.contactEmail} and admin: ${ADMIN_EMAIL}`);
    } catch (smtpError) {
      console.error("[SMTP ERROR] Failed to send actual emails. Falling back to log simulation:", smtpError);
      simulateLog(order, userDetails, userHtmlContent, adminHtmlContent);
    }
  } else {
    simulateLog(order, userDetails, userHtmlContent, adminHtmlContent);
  }
}

function simulateLog(order: any, userDetails: any, userHtml: string, adminHtml: string) {
  console.log("\n=======================================================");
  console.log("            MOCK EMAIL DISPATCH SIMULATION              ");
  console.log("=======================================================");
  console.log(`[MOCK SENDER] From: "Ink & Cotton Club" <system@inkandcottonclub.com>`);
  console.log(`[MOCK RECEIVER] To User: ${order.contactEmail}`);
  console.log(`[MOCK RECEIVER] To Admin: admin@inkandcottonclub.com`);
  console.log(`[SUBJECT] User Invoice: Invoice - Ink & Cotton Club Order ${order.trackingNumber}`);
  console.log(`[SUBJECT] Admin Notification: NEW BESPOKE ORDER RECEIVED - Order ${order.trackingNumber}`);
  console.log("------------------ USER MAIL CONTENT ------------------");
  console.log(`Customer name: ${order.customerName}`);
  console.log(`Total: $${order.totalPrice}`);
  console.log(`Shipping Address: ${order.shippingAddress}`);
  console.log("----------------- ADMIN MAIL CONTENT ------------------");
  console.log(`Membership: ${userDetails?.tier || "Guest"} / Card: ${userDetails?.cardNumber || "None"}`);
  console.log(`Purchased Items: ${order.items}`);
  console.log("=======================================================\n");
}
