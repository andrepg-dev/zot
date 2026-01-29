import { Test, TestingModule } from "@nestjs/testing";
import { ReactToHtmlController } from "./react-to-html.controller";

describe("ReactToHtmlController", () => {
  let controller: ReactToHtmlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactToHtmlController],
    }).compile();

    controller = module.get<ReactToHtmlController>(ReactToHtmlController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
