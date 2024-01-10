import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthInventoryComponent } from './growth-inventory.component';

describe('GrowthInventoryComponent', () => {
  let component: GrowthInventoryComponent;
  let fixture: ComponentFixture<GrowthInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowthInventoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowthInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
