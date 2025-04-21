import express from "express";
import Cart from "../models/Cart.js";
import Session from "../models/Session.js";
import Course from "../models/Course.js";

const router = express.Router();

// GET cart
router.get("/", async (req, res) => {
  //Add your code here
  const sessionId = req.signedCookies.sid;
  const session = await Session.findById(sessionId);

  const courseIds = session.data.cart.map(({ courseId }) => courseId);
  const courses = await Course.find({ _id: { $in: courseIds } });

  const cartCourses = courses.map((course) => {
    const { id, name, item, price, image } = course;
    const { quantity } = session.data.cart.find((item) => item.courseId === id);

    return {
      id,
      name,
      item,
      price,
      image,
      quantity,
    };
  });

  res.status(200).json(cartCourses);
});

// Add to cart
router.post("/", async (req, res) => {
  const { courseId, quantity } = req.body;
  const sessionId = req.signedCookies.sid;
  // One Way
  //   const session = await Session.findById(req.signedCookies.sid);
  //   session.data.cart.push({
  //     courseId,
  //     quantity : 1,
  //   });
  //   session.markModified("data"); // this is important to mark the data as modified because Mongoose does not track changes to nested objects.
  // console.log(session.data.cart);
  //   await session.save();
  //   res.status(201).json({
  //     message: "Course added to cart",
  //     courseId,
  //     quantity,
  //   });

  // * Second Way better approach
  const result = await Session.updateOne(
    { _id: sessionId, "data.cart.courseId": courseId },
    { $inc: { "data.cart.$.quantity": 1 } }
  );

  if (result.matchedCount === 0) {
    await Session.updateOne(
      { _id: sessionId },
      { $push: { "data.cart": { courseId, quantity: 1 } } }
    );
  }

  res.status(201).json({
    message: "Course added to cart",
    courseId,
    quantity,
  });
});

// Remove course from cart
router.delete("/:courseId", async (req, res) => {
  const { courseId } = req.params;
  const sessionId = req.signedCookies.sid;

  await Session.updateOne(
    { _id: sessionId },
    { $pull: { "data.cart": { courseId } } }
  );

  res.status(200).json({ message: "Course removed from cart" });
});

// Clear cart
router.delete("/", async (req, res) => {
  //Add your code here
});

export default router;
