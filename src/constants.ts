import 'dotenv/config';

const NODE_ENV = process.env.NODE_ENV;

export const PG_CONNECTION = 'PG_CONNECTION';
export const PRIVATE_KEY =
  NODE_ENV === 'test' ? 'test' : process.env.PRIVATE_KEY;
export const REFRESH_PRIVATE_KEY =
  NODE_ENV === 'test' ? 'test' : process.env.REFRESH_PRIVATE_KEY;
export const ACCESS_TOKEN_EXPIRES_IN = '1h';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';

export const CLOUDINARY = 'Cloudinary';

export const CLOUDINARY_CLOUDNAME =
  NODE_ENV === 'test' ? 'test' : process.env.CLOUDINARY_CLOUDNAME;
export const CLOUDINARY_FOLDER =
  NODE_ENV === 'test' ? 'test' : process.env.CLOUDINARY_FOLDER;
export const CLOUDINARY_APIKEY =
  NODE_ENV === 'test' ? 'test' : process.env.CLOUDINARY_APIKEY;
export const CLOUDINARY_APISECRET =
  NODE_ENV === 'test' ? 'test' : process.env.CLOUDINARY_APISECRET;
export const CLOUDINARY_URL =
  NODE_ENV === 'test' ? 'test' : process.env.CLOUDINARY_URL;

export const SMTP_SERVER_ADDRESS =
  NODE_ENV === 'test' ? 'test' : process.env.SMTP_SERVER_ADDRESS;
export const SMTP_SERVER_PORT =
  NODE_ENV === 'test' ? 587 : +process.env.SMTP_SERVER_PORT;
export const SMTP_SECURE =
  NODE_ENV === 'test'
    ? false
    : `${process.env.SMTP_SECURE}`.toLowerCase() === 'true';
export const SMTP_USERNAME =
  NODE_ENV === 'test' ? 'test' : process.env.SMTP_USERNAME;
export const SMTP_PASSWORD =
  NODE_ENV === 'test' ? 'test' : process.env.SMTP_PASSWORD;
