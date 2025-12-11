import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orderdashboard } from './orderdashboard';

describe('Orderdashboard', () => {
  let component: Orderdashboard;
  let fixture: ComponentFixture<Orderdashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orderdashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Orderdashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
