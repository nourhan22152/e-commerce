import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UppdateproductDashboard } from './uppdateproduct-dashboard';

describe('UppdateproductDashboard', () => {
  let component: UppdateproductDashboard;
  let fixture: ComponentFixture<UppdateproductDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UppdateproductDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UppdateproductDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
