import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserModelDTO } from './models/user-event-model';
import { UserService } from './user/user.service';
import { UserRequestModel } from './models/user-event-request-model';
import { UserViewModel } from './user/interfaces/user-view-model';
import { User } from './user/interfaces/user.interface.user';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService
  ) {}

  private toViewModel(user:User):UserViewModel{
    const userViewModel:UserViewModel={
      id:user.id,
      name:user.name,
      email:user.email,
      accessKey:user.accessKey,
      rateLimit:user.rateLimit,
      expirationTime:user.expirationTime,
      isEnable:user.isEnable,
    }
    return userViewModel;
  }
  @MessagePattern({cmd:'create-user'})
  async handleUserCreated(data:UserRequestModel){
    const userDTO:CreateUserModelDTO={
      name:data.name,
      email:data.email,
      accessKey:undefined,
      rateLimit:undefined,
      isEnable:undefined,
      expirationTime:undefined,

    }
    
    const user= await this.userService.create(userDTO)
    return this.toViewModel(user)
  }

  @MessagePattern({cmd:'list-users'})
  async ListUser(){
     const userList = await this.userService.listUsers();
     return userList.map(m=>{
      return this.toViewModel(m)
     })
  }
  @MessagePattern({ cmd: 'delete-key' })
  async handleDeleteKey(data: { userId: string }) {
    const user=  await this.userService.deleteKey(data.userId);
    return this.toViewModel(user)
  }

  @MessagePattern({ cmd: 'generate-key' })
  async handleGenerateKey(data: { userId: string, expirationTime: Date , rateLimit:number}) {
    const user=  await this.userService.generateKeyAndRateLimit(data.userId, data.expirationTime,data.rateLimit);
    return this.toViewModel(user)
  }

  @MessagePattern({ cmd: 'update-rate-limit' })
  async handleUpdateRateLimit(data: { userId: string, rateLimit: number }) {
    const user=   await this.userService.updateRateLimit(data.userId, data.rateLimit);
    return this.toViewModel(user)
  }

  @MessagePattern({ cmd: 'update-expiration-time' })
  async handleUpdateExpirationTime(data: { userId: string, expirationTime: Date }) {
    const user=  await this.userService.updateExpirationTime(data.userId, data.expirationTime);
    return this.toViewModel(user)
  }

  @MessagePattern({ cmd: 'disable-access-key' })
  async handleDisableAccessKey(data:{ accessKey: string ,access:boolean}) {
    const user=  await this.userService.disableEnableAccessKey(data.accessKey,data.access);
    return this.toViewModel(user)
  }
  @MessagePattern({ cmd: 'fetch-access-plan' })
  async handleFetchAccessPlan(data: { accessKey: string }) {
    const user=  await this.userService.fetchAccessPlan(data.accessKey);
    return this.toViewModel(user)
  }
}
