import { TestBed } from '@angular/core/testing';

import { SubAccount } from './sub-account';

describe('SubAccount', () => {
  let service: SubAccount;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubAccount);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
