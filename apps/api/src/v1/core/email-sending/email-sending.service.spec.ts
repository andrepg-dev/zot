import { Test, TestingModule } from "@nestjs/testing";
import { EmailSendingService } from "./email-sending.service";

describe("EmailSendingService", () => {
  let service: EmailSendingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSendingService],
    }).compile();

    service = module.get<EmailSendingService>(EmailSendingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
