import { createClient } from "redis";

const redisClient = createClient({
  password: "My$trong123Pass",
});
await redisClient.connect();

const result = await redisClient.ping();
console.log(result);

await redisClient.quit();
