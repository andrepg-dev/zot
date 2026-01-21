import * as joi from "joi";

export default () => ({
  isGlobal: true,
  validationSchema: joi.object({
    MONGODB_DATABASE_URL: joi.string().required(),
    // GOOGLE
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
  }),
});
