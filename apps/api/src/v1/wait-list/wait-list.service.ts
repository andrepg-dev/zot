import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitList } from "./schemas/wait-list.schema";

@Injectable()
export class WaitListService {
  constructor(@InjectModel(WaitList.name) private WaitListModel: Model<WaitList>) {}

  async create(createWaitListDto: CreateWaitListDto, owner: Types.ObjectId) {
    try {
      return await this.WaitListModel.create({
        ...createWaitListDto,
        owner,
      });
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  async findAll(owner: Types.ObjectId) {
    try {
      console.log(owner);
      if (!owner) throw new InternalServerErrorException();

      return await this.WaitListModel.find({ owner });
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  async findOne(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      return await this.WaitListModel.findOne({
        _id: id,
        owner,
      });
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  async update(id: Types.ObjectId, updateWaitListDto: UpdateWaitListDto, owner: Types.ObjectId) {
    try {
      const response = await this.WaitListModel.findOneAndUpdate(
        { _id: id, owner },
        updateWaitListDto,
        { new: true },
      );

      if (!response) {
        throw new NotFoundException(
          `WaitList "${String(id)}" not found or you don't have permission to update it.`,
        );
      }

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  async remove(id: Types.ObjectId, owner: Types.ObjectId) {
    try {
      const response = await this.WaitListModel.findOneAndDelete({
        _id: id,
        owner,
      });

      if (!response) {
        throw new NotFoundException(`WaitList "${String(id)}" not found.`);
      }

      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDatabaseErrors(error);
    }
  }

  private handleDatabaseErrors(error: any) {
    throw new InternalServerErrorException(`Error saving on database: ${error}`);
  }
}
