import { Component, OnInit } from '@angular/core';
import { filter, interval, map } from 'rxjs';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.sass']
})
export class ChallengesComponent implements OnInit {

  counter = 0;
  minCounter = 0;

  get minimumDisplayCounter() {
    if (this.minCounter >= this.counter) {
      return this.minCounter;
    }
    return this.counter;
  }

  next(count: number) {
    this.minCounter = count;
    let section = '';
    switch (count) {
      case 1: section = 'sec_academics'; break;
      case 2: section = 'sec_all_work_no_play'; break;
      case 3: section = 'sec_lack_of_confidence'; break;
      case 4: section = 'sec_communication_gap'; break;
      case 5: section = 'sec_personalization'; break;
      case 6: section = 'sec_team'; break;
      case 6: section = 'timeline'; break;
    }

    setTimeout(() => {
      const elem = document.getElementById(section);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        console.log('scrlling')
      }
      else {
        console.error("where wtf")
      }
    }, 1000)
  }

  ngOnInit() {
    // How long before each message is sent over
    const delayInSec = 12;

    const messages$ = interval(delayInSec * 1000).pipe(
      filter((v) => v !== null && v !== undefined),
      map((_, idx) => idx)
    );

    messages$.subscribe((cnt) => {
      this.counter = cnt;
      console.log(cnt);
    });
  }
}
