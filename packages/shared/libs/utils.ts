import { z } from "zod";

export const emailTransform = (val: any) => {
  if (!val) return undefined;
  if (val.startsWith("http://") || val.startsWith("https://")) {
    return val;
  }
  return `https://${val.replace(/^\/+/, "")}`;
};

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const zMongoId = z
  .string()
  .refine((val) => OBJECT_ID_REGEX.test(val), { message: "Invalid ObjectId" });
