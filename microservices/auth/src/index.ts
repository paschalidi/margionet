import mongoose from 'mongoose';
import {logger} from "./logger";
import {app} from "./app";

const start = async () => {
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET must be defined.')
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID must be defined')
  }
  if (!process.env.GOOGLE_CLIENT_CALLBACK) {
    throw new Error('GOOGLE_CLIENT_CALLBACK must be defined')
  }
  if (!process.env.MONGO_DB_URI || !process.env.MONGO_DB_PASSWORD) {
    throw new Error('MONGO_DB_URI and MONGO_DB_PASSWORD must be defined')
  }
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET must be defined')
  }
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY must be defined')
  }
  logger.info('All environment variables are defined!');

  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    logger.info('Connected to MongoDB for auth!');

  } catch (err) {
    logger.error('COULD NOT CONNECT: MongoDB');
    logger.error(err);
  }

  app.listen(3000, async () => {
    logger.info('Listening on port 3000')
  })
}

(() => start())()
