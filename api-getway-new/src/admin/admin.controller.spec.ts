import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CreateUserRequest } from 'src/models/request.dto';
import { UserViewModel } from 'src/models/user-view-model';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService:AdminService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            createUser: jest.fn(),
            listUser: jest.fn(),
            deletekey: jest.fn(),
            updateRateLimit: jest.fn(),
            updateExpirationTime: jest.fn(),
            disableAccess: jest.fn(),
            generateKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService =  module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); 
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserRequest: CreateUserRequest = { name:'ankit' ,email: 'cosmic.ankit@gmail.com' };
      const userViewModel: UserViewModel = { id: '1',name:'ankit' ,email: 'cosmic.ankit@gmail.com', accessKey: 'key', rateLimit: 10, expirationTime: new Date(), isEnable: true };

      jest.spyOn(adminService, 'createUser').mockResolvedValue(userViewModel);

      const result = await controller.createUserAccess(createUserRequest);
      expect(result).toEqual(userViewModel);
    });
  });
  // .. tests can be created now 
});
