import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: Number(process.env.NODEMAILER_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.NODEMAILER_FROM,
    to: email,
    subject: `Snapvior Admin OTP: ${otp}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1; text-align: center;">Snapvior Admin Login</h2>
        <p>You requested a login OTP for the Snapvior Admin Panel.</p>
        <div style="background: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="font-size: 40px; letter-spacing: 5px; margin: 0; color: #18181b;">${otp}</h1>
        </div>
        <p style="color: #71717a; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="text-align: center; color: #a1a1aa; font-size: 12px;">&copy; 2024 Snapvior Team. All rights reserved.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
