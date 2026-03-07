import { Types } from "mongoose";

export function toObjectId(id: string | undefined | Types.ObjectId): Types.ObjectId {
  if (!id) throw new Error("ID not provided, cannot convert to ObjectId");
  return typeof id === "string" ? new Types.ObjectId(id) : id;
}
