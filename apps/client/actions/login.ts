"use server";

import { LoginFormValues, loginSchema } from "@repo/packages/shared/schemas/index";

const API_URL = process.env.API_URL ?? "http://localhost:3010";

export async function loginAction(data: LoginFormValues) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.message ?? "Validation failed");
  }

  const res = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.data)
  });

  // Obtener el error
  if (!res.ok) {
    const body = await res.json();
    console.log({ body });
  }

  return { success: true, message: "Logged successfully" };
}
