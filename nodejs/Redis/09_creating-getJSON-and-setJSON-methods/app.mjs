import redisClient from "./redis.mjs";

const result = await redisClient.getJSON("test", { user: "Anurag" });

console.log(result);

redisClient.quit();
