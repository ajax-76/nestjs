import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { AdminService } from './admin.service';
import { CreateUserRequest, GenerateKeyRequestObject } from 'src/models/request.dto';
import { UserViewModel } from 'src/models/user-view-model';

describe('AdminService', () => {
  let service: AdminService;
  let clientProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    clientProxyMock = {
      send: jest.fn(),
      emit: jest.fn(),
    } as unknown as jest.Mocked<ClientProxy>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: 'MICROSERVICE_ONE', useValue: clientProxyMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserRequest: CreateUserRequest = { name:'ankit' ,email: 'cosmic.ankit@gmail.com' };
      const userViewModel: UserViewModel = { id: '1',name:'ankit' ,email: 'cosmic.ankit@gmail.com', accessKey: 'key', rateLimit: 10, expirationTime: new Date(), isEnable: true };

      clientProxyMock.send.mockReturnValueOnce(of(userViewModel));

      const result = await service.createUser(createUserRequest);
      expect(result).toEqual(userViewModel);
    });

    it('should throw an error if user creation fails', async () => {
      const createUserRequest: CreateUserRequest = { name:'ankit' ,email: 'cosmic.ankit@gmail.com' };
      clientProxyMock.send.mockReturnValueOnce(throwError(() => new Error('error')));
      await expect(service.createUser(createUserRequest)).rejects.toThrow('error');
    });
  });

  describe('listUser', () => {
    it('should list users', async () => {
      const userViewModel: UserViewModel = { id: '1',name:'ankit' ,email: 'cosmic.ankit@gmail.com', accessKey: 'key', rateLimit: 10, expirationTime: new Date(), isEnable: true };

      clientProxyMock.send.mockReturnValueOnce(of(userViewModel));

      const result = await service.listUser();
      expect(result).toEqual(userViewModel);
    });

    it('should throw an error if listing users fails', async () => {
      clientProxyMock.send.mockReturnValueOnce(throwError(() => new Error('error')));

      await expect(service.listUser()).rejects.toThrow('user list fetch error');
    });
  });

});