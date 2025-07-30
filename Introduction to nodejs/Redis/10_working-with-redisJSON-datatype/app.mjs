import redisClient from "./redis.mjs";

const result = await redisClient.json.get("user:1", {
  path: "$..name",
});

console.log(result);

redisClient.quit();
