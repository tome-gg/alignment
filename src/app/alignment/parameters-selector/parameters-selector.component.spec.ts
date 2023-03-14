import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersSelectorComponent } from './parameters-selector.component';

describe('ParametersSelectorComponent', () => {
  let component: ParametersSelectorComponent;
  let fixture: ComponentFixture<ParametersSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametersSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
