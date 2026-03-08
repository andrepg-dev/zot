import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import DymoAPI from "dymo-api";

@Injectable()
export class EmailSecurityService {
  private readonly dymoClient: DymoAPI;

  constructor(private readonly configService: ConfigService) {
    const dymoApiKey = this.configService.getOrThrow<string>("DYMO_API_KEY");

    this.dymoClient = new DymoAPI({
      apiKey: dymoApiKey,
      rules: {
        email: {
          deny: ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL"],
        },
      },
    });
  }

  async verifyEmail(email: string): Promise<{ isBlocked: boolean; reasons: string[] }> {
    if (!email) {
      throw new HttpException("Email is required.", HttpStatus.BAD_REQUEST);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const decision = await this.dymoClient.isValidEmail(email);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!decision?.allow) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return { isBlocked: true, reasons: decision?.reasons as string[] };
      }

      return { isBlocked: false, reasons: [] };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `Error verifying email. ${(error as Error)?.message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
