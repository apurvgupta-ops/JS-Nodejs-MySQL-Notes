import { mySecretKey } from "../controllers/userController.js";
import User from "../models/userModel.js";
import crypto from "node:crypto";

export default async function checkAuth(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "Not logged in!" });
  }

  const [payload, oldSignature] = token.split(".");

  const jsonPayload = Buffer.from(payload, "base64url").toString();

  const newSignature = crypto
    .createHash("sha256")
    .update(mySecretKey)
    .update(jsonPayload)
    .update(mySecretKey)
    .digest("base64url");

  if (oldSignature !== newSignature) {
    res.clearCookie("token");
    console.log("Invalid signature");
    return res.status(401).json({ error: "Not logged in!" });
  }

  const { id, expiry: expiryTimeInSeconds } = JSON.parse(jsonPayload);

  const currentTimeInSeconds = Math.round(Date.now() / 1000);

  console.log(new Date(currentTimeInSeconds * 1000).toString());
  console.log(new Date(expiryTimeInSeconds * 1000).toString());

  if (currentTimeInSeconds > expiryTimeInSeconds) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Not logged in!" });
  }

  const user = await User.findOne({ _id: id }).lean();
  if (!user) {
    return res.status(401).json({ error: "Not logged in!" });
  }
  req.user = user;
  next();
}
