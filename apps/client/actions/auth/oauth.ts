"use server";

import { redirect } from "next/navigation";

function getBackendUrl() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
  }

  return url.replace(/\/$/, "");
}

export async function signInWithGoogle() {
  redirect(`${getBackendUrl()}/auth/google`);
}

export async function signInWithGitHub() {
  redirect(`${getBackendUrl()}/auth/github`);
}
