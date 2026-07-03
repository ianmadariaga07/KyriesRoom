import { Test, TestingModule } from '@nestjs/testing';
import { SubAccountsService } from './sub-accounts.service';

describe('SubAccountsService', () => {
  let service: SubAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubAccountsService],
    }).compile();

    service = module.get<SubAccountsService>(SubAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
