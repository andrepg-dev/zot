import "dotenv/config";

export const ACCESS_TOKEN_IN_REQUEST_KEY = "access_token";

export const ACCESS_TOKEN = {
  key: "ACCESS_TOKEN_SECRET",
};

export const JWT = {
  key: "JWT_KEY",
  SECRET: process.env.JWT_SECRET,
};
