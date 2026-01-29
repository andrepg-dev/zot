import { Test, TestingModule } from "@nestjs/testing";
import { ReactToHtmlService } from "./react-to-html.service";

describe("ReactToHtmlService", () => {
  let service: ReactToHtmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactToHtmlService],
    }).compile();

    service = module.get<ReactToHtmlService>(ReactToHtmlService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
