import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaAccelerateYourGrowthComponent } from './cta-accelerate-your-growth.component';

describe('CtaAccelerateYourGrowthComponent', () => {
  let component: CtaAccelerateYourGrowthComponent;
  let fixture: ComponentFixture<CtaAccelerateYourGrowthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtaAccelerateYourGrowthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtaAccelerateYourGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
