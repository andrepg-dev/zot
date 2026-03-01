import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitListController } from "./wait-list.controller";
import { WaitListService } from "./wait-list.service";

describe("WaitListController", () => {
  let controller: WaitListController;
  let service: WaitListService;

  const mockWaitListService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitListController],
      providers: [
        {
          provide: WaitListService,
          useValue: mockWaitListService,
        },
      ],
    }).compile();

    controller = module.get<WaitListController>(WaitListController);
    service = module.get<WaitListService>(WaitListService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a waitlist", async () => {
    const dto = { name: "My waitlist" } as CreateWaitListDto;
    const userId = new Types.ObjectId();
    const expected = { _id: new Types.ObjectId(), ...dto };

    mockWaitListService.create.mockResolvedValue(expected);

    const result = await controller.create(dto, userId);

    expect(service.create).toHaveBeenCalledWith(dto, userId);
    expect(result).toBe(expected);
  });

  it("should return all waitlists for a user", async () => {
    const userId = new Types.ObjectId();
    const expected = [{ _id: new Types.ObjectId(), name: "List 1" }];

    mockWaitListService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll(userId);

    expect(service.findAll).toHaveBeenCalledWith(userId);
    expect(result).toBe(expected);
  });

  it("should return a single waitlist", async () => {
    const id = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const expected = { _id: id, name: "List 1" };

    mockWaitListService.findOne.mockResolvedValue(expected);

    const result = await controller.findOne(id, userId);

    expect(service.findOne).toHaveBeenCalledWith(id, userId);
    expect(result).toBe(expected);
  });

  it("should update a waitlist", async () => {
    const id = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const dto = { name: "Updated name" } as UpdateWaitListDto;
    const expected = { _id: id, ...dto };

    mockWaitListService.update.mockResolvedValue(expected);

    const result = await controller.update(id, dto, userId);

    expect(service.update).toHaveBeenCalledWith(id, dto, userId);
    expect(result).toBe(expected);
  });

  it("should remove a waitlist", async () => {
    const id = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const expected = { deleted: true };

    mockWaitListService.remove.mockResolvedValue(expected);

    const result = await controller.remove(id, userId);

    expect(service.remove).toHaveBeenCalledWith(id, userId);
    expect(result).toBe(expected);
  });
});
