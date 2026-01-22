import {} from "mongoose";

declare global {
  namespace Express {
    interface User {
      userId: string;
    }
  }
}
