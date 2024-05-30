import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InkComponent } from './ink.component';

describe('InkComponent', () => {
  let component: InkComponent;
  let fixture: ComponentFixture<InkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
