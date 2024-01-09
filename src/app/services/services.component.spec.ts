import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneOnOneServiceComponent } from './services.component';

describe('ServicesComponent', () => {
  let component: OneOnOneServiceComponent;
  let fixture: ComponentFixture<OneOnOneServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneOnOneServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneOnOneServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
