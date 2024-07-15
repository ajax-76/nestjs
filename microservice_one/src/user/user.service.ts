import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface.user';
import { IUserService } from './interfaces/user-service.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserModelDTO } from 'src/models/user-event-model';

@Injectable()
export class UserService implements IUserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async disableEnableAccessKey(accessKey: string,access:boolean): Promise<User> {
      const user = await this.userModel.findOne({ accessKey });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.isEnable=access;
      return user;
  }

    async listUsers(): Promise<User[]> {
       try{
        const users =await this.userModel.find().exec()
        return users
       }
       catch(err){
        throw new NotFoundException('User not found');
       }
    }
    async deleteKey(userId: string): Promise<User> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.accessKey = undefined;
      return await user.save();
    }
    async generateKeyAndRateLimit(userId: string, expirationTime: Date,rateLimit:number): Promise<User> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.accessKey = this.generateRandomKey();
      user.expirationTime = expirationTime;
      user.rateLimit = rateLimit;
      user.isEnable=true;
      return await user.save();
    }
    async updateRateLimit(userId: string, rateLimit: number): Promise<User> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.rateLimit = rateLimit;
      return await user.save();
    }
    async updateExpirationTime(userId: string, expirationTime: Date): Promise<User> {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.expirationTime = expirationTime;
      return user.save();
    }
   async fetchAccessPlan(accessKey: string): Promise<User> {
      const user = await this.userModel.findOne({ accessKey });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }
  async create(user: CreateUserModelDTO): Promise<User> {
    const createdUser = new this.userModel(user);
    console.log(`user_created : ${JSON.stringify(user)}`)
    try{
      return await createdUser.save();
    }
    catch(err){
      throw new InternalServerErrorException(err);
    }
   
  }
  private generateRandomKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}