import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    // Generate JWT token
    // const token = jwt.sign(
    //   { userId: user._id },
    //   process.env.JWT_SECRET || "your-secret-key",
    //   { expiresIn: "24h" }
    // );

    // If user has guest session
    const guestSession = req.signedCookies.sid;
    const session = await Session.findById(guestSession);

    res.cookie("sid", session.id, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
      signed: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    // const token = jwt.sign(
    //   { userId: user._id },
    //   process.env.JWT_SECRET || "your-secret-key",
    //   { expiresIn: "24h" }
    // );

    const guestSession = req.signedCookies.sid;
    const session = await Session.findById(guestSession);
    if (session) {
      session.expires = Date.now() + 1000 * 60 * 60; // 1 hour
      session.userId = user._id;

      const updateCart = await Cart.create({
        userId: user._id,
        courses: session.data.cart,
      });

      session.data = {};
      await session.save();

      res.cookie("sid", session.id, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, // 1 hour
        signed: true,
      });

      return res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    }
    const newSession = new Session.create({
      userId: user._id,
    });
    res.cookie("sid", newSession.id, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
      signed: true,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", async (req, res) => {
  try {
    const guestSession = req.signedCookies.sid;
    const session = await Session.findById(guestSession);
    if (!session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
