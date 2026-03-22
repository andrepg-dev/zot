import { handleDatabaseErrors } from "@api/src/common/error-handling/handle-database-errors";
import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";
import { Model, Types } from "mongoose";
import { UsersService } from "../users/users.service";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";
import { UpdateApiKeyDto } from "./dto/update-api-key.dto";
import { ApiKey } from "./schemas/api-key.schema";

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKey>,
    private readonly userService: UsersService,
  ) {}

  private generateApiKey(): string {
    return `zot_${randomBytes(32).toString("hex")}`;
  }

  async create(createApiKeyDto: CreateApiKeyDto, userId: Types.ObjectId) {
    try {
      const apiKey = await this.apiKeyModel.create({
        ...createApiKeyDto,
        apiKey: this.generateApiKey(),
        owner: userId,
      });
      return apiKey;
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findAll(userId: Types.ObjectId) {
    try {
      const apiKeys = await this.apiKeyModel.find({ owner: userId });
      return apiKeys;
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async findOne(id: Types.ObjectId, userId: Types.ObjectId) {
    try {
      const apiKey = await this.apiKeyModel.findOne({ _id: id, owner: userId });
      if (!apiKey) {
        throw new NotFoundException(`API key ${id.toString()} not found`);
      }
      return apiKey;
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async update(id: Types.ObjectId, updateApiKeyDto: UpdateApiKeyDto, userId: Types.ObjectId) {
    try {
      const apiKey = await this.apiKeyModel.findOneAndUpdate<ApiKey>(
        { _id: id, owner: userId },
        updateApiKeyDto,
        { new: true },
      );
      if (!apiKey) {
        throw new NotFoundException(`API key ${id.toString()} not found`);
      }
      return apiKey;
    } catch (error) {
      handleDatabaseErrors(error);
    }
  }

  async remove(id: Types.ObjectId, userId: Types.ObjectId) {
    try {
      const apiKey = await this.apiKeyModel.findOneAndDelete({
        _id: id,
        owner: userId,
      });

      if (!apiKey) {
        throw new NotFoundException(`API key ${id.toString()} not found`);
      }

      return { message: "API key deleted successfully" };
    } catch (error) {
      throw new HttpException(String(error), 404);
    }
  }

  async findUserByApiKey(apiKey: string) {
    const key = await this.apiKeyModel.findOne({ apiKey }).select("+owner");

    if (!key) {
      throw new UnauthorizedException(`${apiKey} API Key doesn't exists.`);
    }

    const user = await this.userService.findById(key.owner);

    return user?.toObject();
  }
}
