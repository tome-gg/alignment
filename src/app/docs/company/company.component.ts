import { Component, OnInit } from '@angular/core';
import { filter, interval, map } from 'rxjs';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.sass']
})
export class CompanyComponent implements OnInit {

  counter = 0;
  minCounter = 0;

  get minimumDisplayCounter() {
    if (this.minCounter >= this.counter) {
      return this.minCounter;
    }
    return this.counter;
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
