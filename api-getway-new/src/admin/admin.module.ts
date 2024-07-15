import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module(
  {
    imports:[
      ClientsModule.register([
        {
          name: 'MICROSERVICE_ONE',
          transport: Transport.REDIS,
          options: {
            host: 'localhost',
            port: 6379,
          }
        }
      ]),
    ],
  controllers: [AdminController],
  providers: [AdminService],
},
)
export class AdminModule {}
