import { Component } from '@angular/core';
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'poc';
}
