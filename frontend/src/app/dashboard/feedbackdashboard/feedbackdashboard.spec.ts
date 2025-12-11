import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Feedbackdashboard } from './feedbackdashboard';

describe('Feedbackdashboard', () => {
  let component: Feedbackdashboard;
  let fixture: ComponentFixture<Feedbackdashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feedbackdashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Feedbackdashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
