import { Injectable } from '@nestjs/common';
import { CreateWaitListDto } from './dto/create-wait-list.dto';
import { UpdateWaitListDto } from './dto/update-wait-list.dto';

@Injectable()
export class WaitListService {
  create(createWaitListDto: CreateWaitListDto) {
    return 'This action adds a new waitList';
  }

  findAll() {
    return `This action returns all waitList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} waitList`;
  }

  update(id: number, updateWaitListDto: UpdateWaitListDto) {
    return `This action updates a #${id} waitList`;
  }

  remove(id: number) {
    return `This action removes a #${id} waitList`;
  }
}
