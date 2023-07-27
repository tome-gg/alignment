import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePriceListingComponent } from './service-price-listing.component';

describe('ServicePriceListingComponent', () => {
  let component: ServicePriceListingComponent;
  let fixture: ComponentFixture<ServicePriceListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePriceListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePriceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
