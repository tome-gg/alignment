import { Component } from '@angular/core';
import { Choice } from '../multiple-choice-question/multiple-choice-question.component';

var gtag = window.gtag;

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: []
})
export class PageOnboardingComponent {
  showMentorNotes = false;
  isGrowthInventoryComplete = false;
  isGrowthUrgent : 'undecided'|'yes'|'no' = 'undecided';
  isHealthAndSustainabilitySupportUrgent : 'undecided'|'yes'|'no' = 'undecided';
  isIndependentLearner : 'undecided'|'yes'|'no'|'not_learner' = 'undecided';

  toggleMentorNotes(event: Event) {
    event.preventDefault()
    this.showMentorNotes = !this.showMentorNotes;
    gtag('event', 'show_interest', {
      'event_category': 'apply_as_mentor',
     });
  }

  onGrowthInventoryComplete(choices: Choice[]) {
    this.isGrowthInventoryComplete = true;

    // send data
    // let assessmentStartCookie = getCookie('assessmentStart');
  }

  openTawkChat() {
    (window as any).Tawk_API.popup();
  }

}

function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

