import { Injectable } from "@nestjs/common";
import { CookieOptions, Response } from "express";

@Injectable()
export class CookiesService {
  options: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "strict", // Protección CSRF
    maxAge: 3600000, // 1 hora en milisegundos
  };

  saveCookie(res: Response, key: string, value: any, options?: CookieOptions) {
    return res.cookie(key, value, { ...this.options, ...options });
  }

  clearCookie(res: Response, key: string) {
    return res.clearCookie(key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
}
