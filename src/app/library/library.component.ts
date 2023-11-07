import { Component, ElementRef } from '@angular/core';
import { Choice } from '../multiple-choice-question/multiple-choice-question.component';
import { Subscription, filter, fromEvent } from 'rxjs';

declare var gtag: any;

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.sass']
})
export class LibraryComponent {
  selectedPersona: string|null = null;

  isSelectedPersonaClass = '';
  isNotSelectedPersonaClass = '';

  disposeBag : Subscription[] = [];

  private el!: HTMLElement;

  constructor(el: ElementRef) {
      this.el = el.nativeElement;
  }

  ngOnInit(){
    const sub = fromEvent<TransitionEvent>(this.el, 'transitionend')
      .pipe(filter((res: TransitionEvent) => res.propertyName == "height"))
      .subscribe((res: TransitionEvent) => {
        console.log(res);
      });

    this.disposeBag.push(sub);
}

ngOnDestroy() {
  this.disposeBag && this.disposeBag.forEach(a => a.unsubscribe());
}

  stage: 'one'|'two'|'three'|'four'|'finished' = 'one';

  choices_one: Choice[] = [
    {
      id: '1',
      title: 'The Up-and-Comer',
      descriptionHTML: 'I feel like <span class="text-red-700">a <u>beginner</u> in a new field</span> and I\'m struggling to adapt and learn skills',
      imageUrl: '/assets/2-a.webp'
    },
    {
      id: '2',
      title: 'The Self-Directed Learner',
      descriptionHTML: 'I feel <span class="text-red-700"><u>overwhelmed</u> by the vast amount of information available</span> and I\'m unsure of which resources to trust and follow',
      imageUrl: '/assets/8-a.webp'
    }, 
    {
      id: '3',
      title: 'Both',
      descriptionHTML: 'Both',
      imageUrl: '/assets/16-a.webp'
    }, 
    {
      id: '4',
      title: 'Neither',
      descriptionHTML: 'Neither',
      imageUrl: '/assets/1-a.webp'
    }, 
  ]

  choices_two: Choice[] = [
    {
      id: '5',
      title: 'TEST 2',
      descriptionHTML: 'I feel like <span class="text-red-700">a <u>beginner</u> in a new field</span> and I\'m struggling to adapt and learn skills',
      imageUrl: '/assets/2-a.webp'
    },
    {
      id: '6',
      title: 'TEST 3',
      descriptionHTML: 'I feel <span class="text-red-700"><u>overwhelmed</u> by the vast amount of information available</span> and I\'m unsure of which resources to trust and follow',
      imageUrl: '/assets/8-a.webp'
    }, 
    {
      id: '7',
      title: 'Both',
      descriptionHTML: 'Both',
      imageUrl: '/assets/16-a.webp'
    }, 
    {
      id: '8',
      title: 'Neither',
      descriptionHTML: 'Neither',
      imageUrl: '/assets/1-a.webp'
    }, 
  ]

  selectPersona(persona: string) {
    this.selectedPersona = persona;
    
    gtag('event', 'onboarding', {
      'event_category': 'select_persona',
      'event_label': persona
    })

    setTimeout(() => {
      document.getElementById("library-contents-spacer")?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 200);
  }

  next(choice: Choice) {
    gtag('event', 'onboarding', {
      'event_category': 'select_persona',
      'event_label': choice.title
    });

    switch (this.stage) {
      case 'one': this.stage = 'two'; break;
      case 'two': this.stage = 'three'; break;
      case 'three': this.stage = 'four'; break;
      case 'four': this.stage = 'finished'; break;
    }
  }
}
