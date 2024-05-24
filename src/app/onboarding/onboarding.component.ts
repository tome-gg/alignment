import { Component } from '@angular/core';
import { Choice } from '../multiple-choice-question/multiple-choice-question.component';
import { HasuraService } from '../core/services/hasura.service';
import { concatMap } from 'rxjs';

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

  constructor(private hasuraService: HasuraService) {

  }

  toggleMentorNotes(event: Event) {
    event.preventDefault()
    this.showMentorNotes = !this.showMentorNotes;
    gtag('event', 'show_interest', {
      'event_category': 'apply_as_mentor',
     });
  }

  onGrowthInventoryComplete(choices: Choice[]) {
    this.isGrowthInventoryComplete = true;
    const id = getCookie('assessmentId') || "";
    const data = {
      choices,
      assessmentID: id,
      assessmentStart: getCookie('assessmentStart'),
      assessmentEarliest: getCookie('assessmentEarliest')
    };
    
    this.hasuraService.getUser()
      .pipe(
        concatMap((user) => this.hasuraService.insert(data, id, user?.id || null))
      )
    .subscribe({
      next: (e) => { console.log(e); },
      error: (err) => { console.error(err); },
    });

    // send data
    
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

