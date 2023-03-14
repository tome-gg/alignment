import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoringObjectiveCardComponent } from './mentoring-objective-card.component';

describe('MentoringObjectiveCardComponent', () => {
  let component: MentoringObjectiveCardComponent;
  let fixture: ComponentFixture<MentoringObjectiveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentoringObjectiveCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentoringObjectiveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
