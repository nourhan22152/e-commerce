import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrdersComponent } from './customer-orders';

describe('CustomerOrders', () => {
  let component: CustomerOrdersComponent;
  let fixture: ComponentFixture<CustomerOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
