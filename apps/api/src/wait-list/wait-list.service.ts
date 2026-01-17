import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateWaitListDto } from "./dto/create-wait-list.dto";
import { UpdateWaitListDto } from "./dto/update-wait-list.dto";
import { WaitList } from "./schemas/wait-list.schema";

@Injectable()
export class WaitListService {
  constructor(
    @InjectModel(WaitList.name) private WaitListModel: Model<WaitList>,
  ) {}

  create(CreateWaitListDto: CreateWaitListDto) {
    return this.WaitListModel.create(CreateWaitListDto);
  }

  findAll() {
    return this.WaitListModel.find({});
  }

  findOne(id: string) {
    return this.WaitListModel.findOne({ id });
  }

  update(id: string, updateWaitListDto: UpdateWaitListDto) {
    return this.WaitListModel.findByIdAndUpdate(id, updateWaitListDto);
  }

  remove(id: string) {
    return this.WaitListModel.deleteOne({ id });
  }
}
