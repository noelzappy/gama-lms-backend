import { config } from 'dotenv';
config();

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { MONGO_URL } = process.env;

export const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_FROM, CLIENT_URL } = process.env;

console.log('NODE_ENV', NODE_ENV, 'PORT', PORT, 'SECRET KEY', SECRET_KEY);
