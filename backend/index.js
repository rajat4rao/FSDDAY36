const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Token = require("./models/Token");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send({ message: "User registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.send({ message: "Login successful" });
    } else {
      res.status(400).send({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).send({ message: "Login failed" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await token.save();

    const url = `${process.env.CLIENT_URL}/reset-password/${token.token}`;
    // HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px;">
          <tr>
            <td style="text-align: center; padding-bottom: 20px;">
              <h2 style="color: #333;">Password Reset Request</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #555;">
              <p style="font-size: 16px; line-height: 24px; color: #333;">
                Hello ${user.email || ''},<br/><br/>
                We received a request to reset your password. You can reset it by clicking the button below:
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; color: #555;">
              <p style="font-size: 16px; line-height: 24px; color: #333;">
                The password reset link will be valid for 2 hours. If you did not request a password reset, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 20px; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset Request",
      html: htmlContent, // Use the HTML email content
    });

    

    res.send({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(400).send({ message: "Failed to send password reset link" });
  }
});

app.put("/api/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const passwordResetToken = await Token.findOne({ token });
    if (!passwordResetToken) {
      return res
        .status(400)
        .send({ message: "Invalid or expired password reset token" });
    }

    // Check if token is expired (created more than 2 hours ago)
    const tokenAgeInHours = Math.abs(new Date() - passwordResetToken.createdAt) / (1000 * 60 * 60);
    if (tokenAgeInHours > 2) {
      await passwordResetToken.deleteOne(); // Optionally, delete expired tokens
      return res
        .status(400)
        .send({ message: "Password reset token has expired. Please click forgot password again." });
    }

    const user = await User.findById(passwordResetToken.userId);

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await passwordResetToken.deleteOne();

    res.send({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).send({ message: "Password reset failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
