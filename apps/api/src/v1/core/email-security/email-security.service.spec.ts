import { Test, TestingModule } from "@nestjs/testing";
import { EmailSecurityService } from "./email-security.service";

describe("EmailSecurityService", () => {
  let service: EmailSecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSecurityService],
    }).compile();

    service = module.get<EmailSecurityService>(EmailSecurityService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
