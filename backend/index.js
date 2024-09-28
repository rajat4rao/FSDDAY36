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

const uri = 'mongodb+srv://balprao:igUaFOlnYzPl0tFT@productiondb.cgth5.mongodb.net/passwordreset?retryWrites=true&w=majority&appName=productiondb'

mongoose
  .connect(uri, {
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
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset",
      text: `Click on the link to reset your password: ${url}`,
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
