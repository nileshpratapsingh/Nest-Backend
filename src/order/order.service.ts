import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from "@schemas/user.schema";
import { Model } from "mongoose";
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(User.name) private readonly userModel:Model<UserDocument>
    ){}
  async create(createOrderDto: CreateOrderDto) {
    return null;
  }

  async findAll(userId:string):Promise<any> {
    if(!this.userModel.findById(userId))
        return `No user exists for ${userId}`;
    return null;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
