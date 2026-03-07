import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import DymoAPI from "dymo-api";

const dymoClient = new DymoAPI({
  apiKey: process.env.DYMO_API_KEY,
});

@Injectable()
export class EmailSecurityService {
  async verifyEmail(email: string): Promise<boolean> {
    if (!email) {
      throw new HttpException("Email is required.", HttpStatus.BAD_REQUEST);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decision = await dymoClient.isValidEmail(email);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!decision?.allowed) {
        throw new HttpException(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          `Email not allowed: ${decision?.reasons?.join(", ")}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error verifying email.", HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }
}
