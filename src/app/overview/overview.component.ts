import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {

  isOpen: boolean = false;

  ngAfterViewInit(): void {
      (<any>window).twttr.widgets.load();
  }
}
