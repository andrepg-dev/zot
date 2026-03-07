import "dotenv/config";

// this is the cookie key where we storage the access_token
export const SAVE_ACCESS_TOKEN_IN_COOKIES_KEY = "access_token";

// this is the cookie key where we storage the refresh_token
export const SAVE_REFRESH_TOKEN_IN_COOKIES_KEY = "refresh_token";

// This is the key and the password of the JWT authentication
export const JWT = {
  key: "JWT_SECRET",
  SECRET: process.env.JWT_SECRET,
};
