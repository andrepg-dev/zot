import { Test, TestingModule } from "@nestjs/testing";
import { AiServerConnectionService } from "./ai-server-connection.service";

describe("AiServerConnectionService", () => {
  let service: AiServerConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiServerConnectionService],
    }).compile();

    service = module.get<AiServerConnectionService>(AiServerConnectionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
