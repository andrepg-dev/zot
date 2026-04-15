import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateEmailResponse, ResendService } from "nestjs-resend";
import { EmailParams, EmailSending, ResendEmail } from "../../types/email-sending";

@Injectable()
export class EmailSendingService implements EmailSending {
  constructor(protected resendService: ResendService) {}

  async send(params: EmailParams) {
    switch (params.provider) {
      case "resend": {
        const provider = new ResendProvider(this.resendService);
        return await provider.send(params);
      }
      default:
        throw new HttpException("Email provider not sent, please provide one.", 500);
    }
  }
}

export class ResendProvider extends EmailSendingService implements EmailSending {
  constructor(resendService: ResendService) {
    super(resendService);
  }

  /**
   * Function to send emails using resend services
   */
  async send(data: ResendEmail): Promise<CreateEmailResponse> {
    const { to, from, subject, options } = data;

    if (!options.html) {
      throw new InternalServerErrorException("HTML is required, please provide it.");
    }

    const response = await this.resendService.send({
      ...options,
      to,
      from,
      subject,
      html: options.html,
    });

    if (response.error) {
      throw new InternalServerErrorException(`Error sending email: ${response.error.message}`);
    }

    return response;
  }
}

export class SESProvider extends EmailSendingService implements EmailSending {}
