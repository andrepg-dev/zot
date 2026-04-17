import { HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import {
  CreateBatchResponse,
  CreateBatchSuccessResponse,
  CreateEmailOptions,
  CreateEmailResponse,
  ResendService,
} from "nestjs-resend";
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

  async sendBatch(params: EmailParams[]): Promise<CreateBatchSuccessResponse> {
    if (params.length === 0) {
      return { data: [] };
    }

    const provider = params[0].provider;
    if (provider !== "resend") {
      throw new HttpException("Email provider not supported for batch.", 500);
    }

    const resendProvider = new ResendProvider(this.resendService);
    return resendProvider.sendBatch(params as ResendEmail[]);
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

  async sendBatch(items: ResendEmail[]): Promise<CreateBatchSuccessResponse> {
    const payload: CreateEmailOptions[] = items.map(({ to, from, subject, options }) => {
      if (!options.html) {
        throw new InternalServerErrorException("HTML is required, please provide it.");
      }

      return {
        ...options,
        to,
        from,
        subject,
        html: options.html,
      };
    });

    const response: CreateBatchResponse = await this.resendService.sendBatch(payload);

    if (response.error) {
      throw new InternalServerErrorException(
        `Error sending batch email: ${response.error.message}`,
      );
    }

    return { data: response.data?.data ?? [] };
  }
}

export class SESProvider extends EmailSendingService implements EmailSending {}
