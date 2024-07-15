import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app-services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RequestValidationMiddleware } from './middleware/request.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { AdminModule } from './admin/admin.module';
import { TokenBucketService } from './app-services/tokenBucketRateLimitter';

@Module({
  imports: [
    CacheModule.register(),
    ClientsModule.register([
      {
        name: 'MICROSERVICE_ONE',
        transport: Transport.REDIS,
        options: {
          host:process.env.REDIS_HOST,
          port: 6379,
        }
      },
      {
        name: 'MICROSERVICE_TWO',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: 6379,
        }
      },
    ]),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService,TokenBucketService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestValidationMiddleware)
      .forRoutes('users/token-info');
  }
}
