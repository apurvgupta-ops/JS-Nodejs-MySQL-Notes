import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://redis-19577.c240.us-east-1-3.ec2.redns.redis-cloud.com:19577",
  password: "tFjLlEcJZJV2Jm6mhrB3D0uuXapSk9Vp",
});
await redisClient.connect();

const result = await redisClient.keys("*");
console.log(result);

await redisClient.quit();
