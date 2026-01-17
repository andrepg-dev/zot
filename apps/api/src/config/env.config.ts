import * as joi from "joi";

export default () => ({
  isGlobal: true,
  validationSchema: joi.object({
    MONGODB_DATABASE_URL: joi.string().required(),
  }),
});
