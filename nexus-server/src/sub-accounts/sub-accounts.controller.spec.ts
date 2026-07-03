import { Test, TestingModule } from '@nestjs/testing';
import { SubAccountsController } from './sub-accounts.controller';
import { SubAccountsService } from './sub-accounts.service';

describe('SubAccountsController', () => {
  let controller: SubAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubAccountsController],
      providers: [SubAccountsService],
    }).compile();

    controller = module.get<SubAccountsController>(SubAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
