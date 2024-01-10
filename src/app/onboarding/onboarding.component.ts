import { Component } from '@angular/core';

var gtag = window.gtag;

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: []
})
export class PageOnboardingComponent {
  showMentorNotes: boolean = false;
  proceed: boolean = false;

  toggleMentorNotes(event: Event) {
    event.preventDefault()
    this.showMentorNotes = !this.showMentorNotes;
    gtag('event', 'show_interest', {
      'event_category': 'apply_as_mentor',
     });
    }

  openTawkChat() {
    (window as any).Tawk_API.popup();
  }

  submitEmail(event: Event) {
    event.preventDefault();

    // TODO: send email somewhere
  }

  showEmailPrompt(event: Event) {
    event.preventDefault(); this.proceed = false; return;
  }

  skipEmail(event: Event) {
    event.preventDefault();
    this.proceed = true;
  }
}
