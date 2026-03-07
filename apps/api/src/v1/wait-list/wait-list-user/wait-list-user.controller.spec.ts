import { Test, TestingModule } from "@nestjs/testing";
import { Types } from "mongoose";
import { RegisterWaitListUserDto } from "./dto/register-wait-list-user.dto";
import { WaitListUserController } from "./wait-list-user.controller";
import { WaitListUserService } from "./wait-list-user.service";

describe("WaitListUserController", () => {
  let controller: WaitListUserController;
  let service: WaitListUserService;

  const mockWaitListUserService = {
    register: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    countReferred: jest.fn(),
    findByEmail: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitListUserController],
      providers: [
        {
          provide: WaitListUserService,
          useValue: mockWaitListUserService,
        },
      ],
    }).compile();

    controller = module.get<WaitListUserController>(WaitListUserController);
    service = module.get<WaitListUserService>(WaitListUserService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should register a user in a waitlist", async () => {
    const waitlistId = new Types.ObjectId();
    const dto = { email: "test@example.com" } as RegisterWaitListUserDto;
    const expected = { _id: new Types.ObjectId(), ...dto, waitlistId };

    mockWaitListUserService.register.mockResolvedValue(expected);

    const result = await controller.register(waitlistId, dto);

    expect(service.register).toHaveBeenCalledWith(waitlistId, dto);
    expect(result).toBe(expected);
  });

  it("should return all users for a waitlist", async () => {
    const waitlistId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const expected = [{ _id: new Types.ObjectId(), email: "a@example.com" }];

    mockWaitListUserService.findAll.mockResolvedValue(expected);

    const result = await controller.findAll(waitlistId, userId);

    expect(service.findAll).toHaveBeenCalledWith(waitlistId, userId);
    expect(result).toBe(expected);
  });

  it("should return count information for a waitlist", async () => {
    const waitlistId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    mockWaitListUserService.count.mockResolvedValue(10);
    mockWaitListUserService.countReferred.mockResolvedValue(3);

    const result = await controller.count(waitlistId, userId);

    expect(service.count).toHaveBeenCalledWith(waitlistId, userId);
    expect(service.countReferred).toHaveBeenCalledWith(waitlistId, userId);
    expect(result).toEqual({ total: 10, referred: 3 });
  });

  it("should find a user by email", async () => {
    const waitlistId = new Types.ObjectId();
    const email = "findme@example.com";
    const userId = new Types.ObjectId();
    const expected = { _id: new Types.ObjectId(), email, waitlistId };

    mockWaitListUserService.findByEmail.mockResolvedValue(expected);

    const result = await controller.findByEmail(waitlistId, email, userId);

    expect(service.findByEmail).toHaveBeenCalledWith(waitlistId, email, userId);
    expect(result).toBe(expected);
  });

  it("should remove a user from a waitlist", async () => {
    const waitlistId = new Types.ObjectId();
    const email = "delete@example.com";
    const userId = new Types.ObjectId();
    const expected = { deleted: true };

    mockWaitListUserService.remove.mockResolvedValue(expected);

    const result = await controller.remove(waitlistId, email, userId);

    expect(service.remove).toHaveBeenCalledWith(waitlistId, email, userId);
    expect(result).toBe(expected);
  });
});
