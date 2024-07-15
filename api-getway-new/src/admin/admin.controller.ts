import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserRequest, GenerateKeyRequestObject } from '../models/request.dto';
import { UserViewModel } from 'src/models/user-view-model';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
  @Post()
  createUserAccess(@Body() createUserObjectRequest:CreateUserRequest){
    return this.adminService.createUser(createUserObjectRequest);
  }

  @Get('/list_user')
  async listUser():Promise<UserViewModel[]>{
    return this.adminService.listUser();
  }
  @Delete(':userId/key')
  async deleteKey(@Param('userId') userId: string):Promise<UserViewModel> {
    return this.adminService.deletekey(userId);
  }

  @Post(':userId/key')
  async generateKey(@Param('userId') userId: string,
   @Body()genrateKeyAccessObject:GenerateKeyRequestObject) :Promise<UserViewModel>{
    return this.adminService.generateKey(userId,genrateKeyAccessObject);
  }

  @Patch(':userId/rate-limit')
  async updateRateLimit(@Param('userId') userId: string,
   @Body('rateLimit') rateLimit: number) :Promise<UserViewModel>{
    return this.adminService.updateRateLimit(userId,rateLimit);
  }

  @Patch(':userId/expiration-time')
  async updateExpirationTime(@Param('userId') userId: string, 
  @Body('expirationTime') expirationTime: string) :Promise<UserViewModel>{
    return this.adminService.updateExpirationTime(userId,new Date(expirationTime))
  }

  @Patch('disable-enable-access-plan/:accessKey')
  async DisabelEnableAccessPlan(@Param('accessKey') accessKey: string
  ,@Body('access') access: boolean) :Promise<UserViewModel>{
    return this.adminService.disableAccess(accessKey,access);
  }
}
