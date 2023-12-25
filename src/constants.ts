import 'dotenv/config';

export const PG_CONNECTION = 'PG_CONNECTION';
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const REFRESH_PRIVATE_KEY = process.env.REFRESH_PRIVATE_KEY;
export const ACCESS_TOKEN_EXPIRES_IN = '1h';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';

export const CLOUDINARY = 'Cloudinary';

export const CLOUDINARY_CLOUDNAME = process.env.CLOUDINARY_CLOUDNAME;
export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;
export const CLOUDINARY_APIKEY = process.env.CLOUDINARY_APIKEY;
export const CLOUDINARY_APISECRET = process.env.CLOUDINARY_APISECRET;
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
