import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductsDashboard } from './edit-products-dashboard';

describe('EditProductsDashboard', () => {
  let component: EditProductsDashboard;
  let fixture: ComponentFixture<EditProductsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
