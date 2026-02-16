import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ResendService } from "nestjs-resend";
import { EmailParams, EmailSending, ResendEmail } from "../../types/email-sending";

@Injectable()
export class EmailSendingService implements EmailSending {
  constructor(protected resendService: ResendService) {}

  async send(params: EmailParams): Promise<{ successful: boolean }> {
    switch (params.provider) {
      case "resend": {
        const provider = new ResendProvider(this.resendService);
        await provider.send(params);
        break;
      }
      default:
        throw new HttpException("Email provider not sent, please provide one.", 500);
    }

    return { successful: true };
  }
}

export class ResendProvider extends EmailSendingService implements EmailSending {
  constructor(resendService: ResendService) {
    super(resendService);
  }

  /**
   * Function to send emails using resend services
   */
  async send(options: ResendEmail): Promise<any> {
    try {
      return await this.resendService.send({
        ...options,
        text: options.options.text ?? "",
      });
    } catch (err) {
      throw new InternalServerErrorException(`Error sending email: ${err}`);
    }
  }
}

export class SESProvider extends EmailSendingService implements EmailSending {}
