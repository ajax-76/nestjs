import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AppService } from './app-services/app.service';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async hello() {
    return 'hello world'
  }

  @Get('users/access-plan/:accessKey')
  async fetchAccessPlan(@Param('accessKey') accessKey: string) {
    return this.appService.getAccessKey(accessKey);
  }

  @Get('users/token-info')
  async fetchTokenInfo(@Query('accessKey') accessKey: string,
  @Query('tokenAddress') tokenAddress: string) {
      return this.appService.getTokenInfo(accessKey,tokenAddress);
  }

  @Patch('users/disable-enable-access-plan/:accessKey')
  async DisabelEnableAccessPlan(@Param('accessKey') accessKey: string
  ,@Body('access') access: boolean) {
    return this.appService.disableAccess(accessKey,access);
  }
}
