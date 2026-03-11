import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }

    interface User {
      userId: Types.ObjectId;
    }
  }
}
