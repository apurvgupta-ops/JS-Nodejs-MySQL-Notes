import express from "express";
import redisClient from "./redis.mjs";

const app = express();

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const redisKey = `user:${userId}`;
  const cachedUser = await redisClient.json.get(redisKey);
  console.log({ cachedUser });
  if (cachedUser) {
    return res.json(cachedUser);
  }
  const userData = await getUser(req.params.id);
  await redisClient.json.set(redisKey, "$", userData);
  await redisClient.expire(redisKey, 60 * 60 * 24);
  res.json(userData);
});

app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  const redisKey = `user:${userId}`;
  await updateUser(userId, userData);
  await redisClient.del(redisKey);
});

app.listen(4000, () => {
  console.log("Server started on 4000");
});

async function getUser(userId) {
  const response = await fetch(`https://fakestoreapi.com/users/${userId}`);
  return await response.json();
}

async function updateUser(userId, userData) {}
