import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipComponent } from './mentorship.component';

describe('MentorshipComponent', () => {
  let component: MentorshipComponent;
  let fixture: ComponentFixture<MentorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorshipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
