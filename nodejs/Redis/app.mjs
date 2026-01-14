import { createClient } from "redis";

const redisClient = await createClient().connect();

const result = await redisClient.get("user");

console.log(JSON.parse(result));

await redisClient.quit();
