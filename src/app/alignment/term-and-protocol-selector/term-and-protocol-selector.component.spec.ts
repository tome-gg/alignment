import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermAndProtocolSelectorComponent } from './term-and-protocol-selector.component';

describe('TermAndProtocolSelectorComponent', () => {
  let component: TermAndProtocolSelectorComponent;
  let fixture: ComponentFixture<TermAndProtocolSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermAndProtocolSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermAndProtocolSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
