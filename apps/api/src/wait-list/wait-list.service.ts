import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitList } from "./schemas/wait-list.schema";

@Injectable()
export class WaitListService {
  constructor(
    @InjectModel(WaitList.name) private WaitListModel: Model<WaitList>,
  ) {}

  async create(CreateWaitListDto: CreateWaitListDto) {
    return await this.WaitListModel.create(CreateWaitListDto);
  }

  async findAll() {
    return await this.WaitListModel.find({});
  }

  async findOne(id: Types.ObjectId) {
    return await this.WaitListModel.findOne({ id });
  }

  async update(id: Types.ObjectId, updateWaitListDto: UpdateWaitListDto) {
    return await this.WaitListModel.findByIdAndUpdate(id, updateWaitListDto);
  }

  async remove(id: Types.ObjectId) {
    return await this.WaitListModel.deleteOne({ id });
  }
}
