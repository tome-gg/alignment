import { Component } from '@angular/core';

@Component({
  selector: 'app-mentorship',
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.sass']
})
export class MentorshipComponent {
  openTawkChat() {
    (window as any).Tawk_API.popup();
  }
}
