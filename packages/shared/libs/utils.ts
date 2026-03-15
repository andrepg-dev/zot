import { ObjectId } from "mongodb";
import { z } from "zod";

export const emailTransform = (val: any) => {
  if (!val) return undefined;
  if (val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }
  return `https://${val.replace(/^\/+/, "")}`;
};

export const zMongoId = z
  .string()
  .refine((val) => ObjectId.isValid(val), { message: "Invalid ObjectId" });
