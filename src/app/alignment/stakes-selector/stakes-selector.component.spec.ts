import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakesSelectorComponent } from './stakes-selector.component';

describe('StakesSelectorComponent', () => {
  let component: StakesSelectorComponent;
  let fixture: ComponentFixture<StakesSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakesSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StakesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
