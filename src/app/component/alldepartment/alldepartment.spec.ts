import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDepartment } from './alldepartment';

describe('Alldepartment', () => {
  let component: AllDepartment;
  let fixture: ComponentFixture<AllDepartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDepartment],
    }).compileComponents();

    fixture = TestBed.createComponent(AllDepartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
