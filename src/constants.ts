import 'dotenv/config';

export const PG_CONNECTION = 'PG_CONNECTION';
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const REFRESH_PRIVATE_KEY = process.env.REFRESH_PRIVATE_KEY;
export const ACCESS_TOKEN_EXPIRES_IN = '1h';
export const REFRESH_TOKEN_EXPIRES_IN = '30d';
