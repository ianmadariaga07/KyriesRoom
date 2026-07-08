import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountModal } from './sub-account-modal';

describe('SubAccountModal', () => {
  let component: SubAccountModal;
  let fixture: ComponentFixture<SubAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubAccountModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubAccountModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
