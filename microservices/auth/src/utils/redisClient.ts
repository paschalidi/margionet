import { createClient } from "redis";
import { logger } from "../logger";

const redisClient =
  createClient({
      socket: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!)
      }
    }
  )
redisClient
  .connect()
  .then(() => {
    logger.info('Redis client connected!');
  })
  .catch((e) => {
    logger.error('Redis client connection failed!', e);
    process.exit(1);
  })

export { redisClient }