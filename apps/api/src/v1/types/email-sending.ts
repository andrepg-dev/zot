import { CreateEmailOptions } from "nestjs-resend";

export type BaseEmail = {
  to: string | [string];
  from: string;
  subject: string;
};

export type ResendEmail = BaseEmail & {
  provider: "resend";
  options: Omit<CreateEmailOptions, "from" | "to" | "subject">;
};

export type EmailParams = ResendEmail;

export interface EmailSending {
  send(params: EmailParams): any;
}
