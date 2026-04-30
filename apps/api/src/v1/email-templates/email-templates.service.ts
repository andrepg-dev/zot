import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import puppeteer from "puppeteer";
import { S3Service } from "../core/aws/s3/s3.service";
import { ReactToHtmlService } from "../core/react-to-html/react-to-html.service";
import { UserQuoteService } from "../users/user-quote/user-quote.service";
import { CreateEmailTemplateDto } from "./dto/create-email-template.dto";
import { UpdateEmailTemplateDto } from "./dto/update-email-template.dto";
import { EmailTemplate } from "./schemas/email-template.schema";

const WELCOME_TEMPLATE_CODE = `const Email = ({ position = "", email = "" } = {}) => (
  <Html>
    <Head />
    <Preview>You're on the waitlist</Preview>
    <Body style={{ backgroundColor: "#f6f6f6", fontFamily: "Arial, sans-serif" }}>
      <Container style={{ backgroundColor: "#ffffff", padding: "32px", margin: "40px auto", maxWidth: "560px", borderRadius: "8px" }}>
        <Heading style={{ fontSize: "22px", margin: "0 0 16px" }}>You're in!</Heading>
        <Text style={{ fontSize: "16px", color: "#333", margin: "0 0 12px" }}>
          Thanks for joining. We saved your spot on the waitlist.
        </Text>
        <Text style={{ fontSize: "16px", color: "#333", margin: "0 0 8px" }}>
          Email: <strong>{email}</strong>
        </Text>
        <Text style={{ fontSize: "16px", color: "#333", margin: "0 0 24px" }}>
          Your position: <strong>#{position}</strong>
        </Text>
        <Text style={{ fontSize: "14px", color: "#777", margin: 0 }}>
          We'll keep you posted as we get closer to launch.
        </Text>
      </Container>
    </Body>
  </Html>
);`;

@Injectable()
export class EmailTemplatesService {
  private readonly logger = new Logger(EmailTemplatesService.name);

  constructor(
    @InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>,
    private readonly reactToHtmlService: ReactToHtmlService,
    private readonly userQuoteService: UserQuoteService,
    private readonly s3Service: S3Service,
  ) {}

  async seedDefault(owner: Types.ObjectId) {
    try {
      return await this.create(
        {
          alias: "Welcome email",
          subject: "You're on the waitlist",
          code: WELCOME_TEMPLATE_CODE,
          status: "published",
        },
        owner,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to seed default email template for ${owner.toString()}: ${(error as Error).message}`,
      );
      return null;
    }
  }

  async screenshotHTML(html: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 800, height: 600 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    const element = await page.$("table");

    if (!element) {
      await browser.close();
      throw new InternalServerErrorException();
    }

    const screenshot = await element.screenshot();
    await browser.close();

    return screenshot;
  }

  async create(createEmailTemplateDto: CreateEmailTemplateDto, owner: Types.ObjectId) {
    try {
      await this.userQuoteService.editUserQuote({
        ownerId: owner,
        service: "emailsTemplates",
        usage: 1,
      });

      const compiledCode = await this.reactToHtmlService.compile(createEmailTemplateDto.code);
      const imageBuffer = await this.screenshotHTML(compiledCode);

      const { url } = await this.s3Service.uploadSingleFile({
        file: {
          buffer: imageBuffer,
          mimetype: "image/png",
          originalname: `email-template-${Date.now()}.png`,
        },
      });
      const image = await url;

      if (!image.url) {
        throw new InternalServerErrorException("Cannot upload image to S3 service");
      }

      return await this.EmailTemplateModel.create({
        ...createEmailTemplateDto,
        html: compiledCode,
        owner,
        preview: image.url,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error creating email template.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.find({ owner }).sort({ createdAt: -1 });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching email templates.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      const template = await this.EmailTemplateModel.findOne({ _id: id, owner });
      if (!template) {
        throw new HttpException(
          `Template ${id.toString()} not found or you don't have permission to access it.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      return template;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error fetching email template.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(
    id: Types.ObjectId,
    updateEmailTemplateDto: UpdateEmailTemplateDto,
    owner: Types.ObjectId,
  ) {
    try {
      return await this.EmailTemplateModel.findOneAndUpdate(
        { _id: id, owner },
        updateEmailTemplateDto,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error updating email template.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      return await this.EmailTemplateModel.findOneAndDelete({ _id: id, owner });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Error deleting email template.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
