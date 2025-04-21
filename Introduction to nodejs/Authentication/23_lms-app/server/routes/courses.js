import express from "express";
import Session from "../models/Session.js";
import Course from "../models/Course.js";

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    if(!req.signedCookies.sid) {
       const sessions = await Session.create({})
       res.cookie("sid", sessions.id, {
         httpOnly: true,
         maxAge: 1000 * 60 * 60, // 1 hour
         signed : true
       });
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
