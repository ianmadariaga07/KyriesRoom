import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteTransaction } from './confirm-delete-transaction';

describe('ConfirmDeleteTransaction', () => {
  let component: ConfirmDeleteTransaction;
  let fixture: ComponentFixture<ConfirmDeleteTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteTransaction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
