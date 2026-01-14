import { createClient, SchemaFieldTypes } from "redis";

const redisClient = createClient();
await redisClient.connect();


redisClient.quit();
