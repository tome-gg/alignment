import { Component } from '@angular/core';

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
}
