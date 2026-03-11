import * as joi from "joi";

export default () => ({
  isGlobal: true,
  validationSchema: joi.object({
    MONGODB_DATABASE_URL: joi.string().required(),
    // GOOGLE
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),

    // GITHUB
    GITHUB_CLIENT_ID: joi.string().required(),
    GITHUB_CLIENT_SECRET: joi.string().required(),

    // General
    BACKEND_URL: joi.string().required(),
    FRONTEND_URL: joi.string().required(),

    // RESEND_API_KEY
    RESEND_API_KEY: joi.string().required(),

    // DYMO_API_KEY
    DYMO_API_KEY: joi.string().required(),

    // STRIPE
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_WEBHOOK_SECRET: joi.string().required(),
    STRIPE_PREMIUM_PRICE_ID: joi.string().required(),
  }),
});
