import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Productdashboard } from './productdashboard';

describe('Productdashboard', () => {
  let component: Productdashboard;
  let fixture: ComponentFixture<Productdashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Productdashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Productdashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
