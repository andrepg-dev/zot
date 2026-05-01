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
    <Preview>You're on the waitlist. Position #{position}.</Preview>
    <Tailwind>
      <Body className="bg-zinc-100 m-0 py-12 px-4 font-sans">
        <Container className="bg-white mx-auto max-w-[560px] border border-solid border-zinc-200">
          <Section className="px-10 pt-8 pb-2">
            <Text className="text-[13px] tracking-[0.18em] uppercase text-zinc-600 m-0 font-semibold">
              Waitlist
            </Text>
          </Section>

          <Section className="px-10 pt-5 pb-7">
            <Heading as="h1" className="text-[32px] leading-[38px] text-zinc-950 m-0 mb-3 font-semibold tracking-tight">
              You're in.
            </Heading>
            <Text className="text-base leading-6 text-zinc-600 m-0">
              Thanks for signing up. Your spot is saved and we'll be in touch as we get closer to launch.
            </Text>
          </Section>

          <Section className="px-10 pb-8">
            <Section className="bg-zinc-950 px-7 py-6">
              <Text className="text-[11px] tracking-[0.2em] uppercase text-zinc-400 m-0 mb-1.5 font-semibold">
                Your position
              </Text>
              <Heading as="h2" className="text-[44px] leading-[48px] text-zinc-50 m-0 font-semibold tracking-tighter">
                #{position}
              </Heading>
              <Text className="text-[13px] text-zinc-400 mt-2.5 mb-0">
                The earlier you joined, the earlier you get access.
              </Text>
            </Section>
          </Section>

          <Hr className="border-zinc-200 mx-10 my-3" />

          <Text className="px-10 text-[11px] tracking-[0.2em] uppercase text-zinc-500 m-0 mb-4 font-semibold">
            What happens next
          </Text>

          <Section className="px-10 pb-4">
            <Text className="text-[13px] text-zinc-400 m-0 mb-1 font-semibold font-mono">01</Text>
            <Text className="text-[15px] text-zinc-950 m-0 mb-1 font-semibold">
              We'll send updates that matter
            </Text>
            <Text className="text-sm leading-[22px] text-zinc-600 m-0">
              Milestones, behind the scenes notes, and the occasional sneak peek. No spam, no filler.
            </Text>
          </Section>

          <Section className="px-10 pb-4">
            <Text className="text-[13px] text-zinc-400 m-0 mb-1 font-semibold font-mono">02</Text>
            <Text className="text-[15px] text-zinc-950 m-0 mb-1 font-semibold">
              You'll get early access
            </Text>
            <Text className="text-sm leading-[22px] text-zinc-600 m-0">
              When access opens, we'll roll it out in batches starting at the top of the list.
            </Text>
          </Section>

          <Section className="px-10 pb-4">
            <Text className="text-[13px] text-zinc-400 m-0 mb-1 font-semibold font-mono">03</Text>
            <Text className="text-[15px] text-zinc-950 m-0 mb-1 font-semibold">
              Your feedback shapes the launch
            </Text>
            <Text className="text-sm leading-[22px] text-zinc-600 m-0">
              Early members help decide what we build first. Reply to any of our emails and you'll reach a real person.
            </Text>
          </Section>

          <Hr className="border-zinc-200 mx-10 my-3" />

          <Section className="px-10 pt-6 pb-3">
            <Text className="text-[15px] leading-[23px] text-zinc-800 m-0 mb-2">
              We're glad you're here. More soon.
            </Text>
            <Text className="text-[15px] text-zinc-800 m-0">The team</Text>
          </Section>

          <Section className="px-10 pt-6 pb-8">
            <Text className="text-xs text-zinc-500 m-0 mb-1 font-mono">{email}</Text>
            <Text className="text-xs leading-[18px] text-zinc-400 m-0">
              You're receiving this because you joined the waitlist. If this wasn't you, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
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
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
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
