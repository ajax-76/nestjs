import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{
        provide:AppService,
        useValue:{
          getTokenInFormation:jest.fn()
        }
      }],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService =  app.get<AppService>(AppService);
  });
  describe('token information',()=>{
    it('should return token info ',async ()=>{
      const tokenAddress = '0xrewv2ewvewrgrvwrf';
      const mockReturnValue = {
        tokenName:"SOMETOKEN",
        tokenAddress:tokenAddress,
        decimalPoints:10,
        symbol:'SOM',
      }
      jest.spyOn(appService, 'getTokenInFormation').mockResolvedValue(mockReturnValue);
      const result = await appController.getTokenInfo({tokenAddress});
      expect(result).toEqual(mockReturnValue);
    })
  })
});
