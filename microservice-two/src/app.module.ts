import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MICROSERVICE_ONE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: 6379,
        }
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
