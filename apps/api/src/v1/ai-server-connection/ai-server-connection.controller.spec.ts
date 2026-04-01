import { Test, TestingModule } from "@nestjs/testing";
import { AiServerConnectionController } from "./ai-server-connection.controller";

describe("AiServerConnectionController", () => {
  let controller: AiServerConnectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiServerConnectionController],
    }).compile();

    controller = module.get<AiServerConnectionController>(AiServerConnectionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
