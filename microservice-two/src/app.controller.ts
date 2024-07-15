import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'token-information' })
  getTokenInfo(data:{tokenAddress:string}) {
    return this.appService.getTokenInFormation(data.tokenAddress);
  }
}
