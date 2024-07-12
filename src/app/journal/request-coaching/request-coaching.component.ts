import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import classNames from 'classnames';
import { DateTime, Zone } from 'luxon';
import { catchError, map, of, single, Subscription, tap } from 'rxjs';
import { HasuraService } from 'src/app/core/services/hasura.service';
import { AppMdxEditor } from 'src/app/mdx-editor/mdx-editor.component';
import { RequestForCoachingTemplate } from './prompts';

@Component({
  selector: 'app-request-coaching',
  templateUrl: './request-coaching.component.html',
  styleUrl: './request-coaching.component.sass'
})
export class RequestCoachingComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('journaleditor') editor!: AppMdxEditor;

  value: String = "";

  isEditable = true;

  state: "editing"|"loading"|"done" = "editing";

  markdownContent: string = '';
  original: string = '';
  entry: any;

  subscriptions: Subscription[] = [];

  get lastEdited() {
    const createdAt = this.entry?.created_at;
    if (createdAt) {
      const dt = DateTime.fromISO(createdAt, { zone: 'GMT0'});
      return dt.toRelative() ;
    }
    return '';
  }

  constructor(private hasura: HasuraService) {
    this.original = ``;

    this.markdownContent = this.original;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  ngAfterViewInit(): void {

    

    let s = this.hasura.getCurrentRequestForCoaching()
    .pipe(
      tap((data) => {
        this.entry = data;
      }),
      map((data) => {
        return data?.contents;
      }),
      single(),
      catchError(() => of(RequestForCoachingTemplate))
    )
    .subscribe({
      next: (data: any) => {
        this.original = data;
        this.value = data;
        this.markdownContent = data;
      }
    })

    this.subscriptions.push(s);
  }

  setValue(value: String) {
    this.value = value;
  }

  classNames = classNames;

  sendData(){
    
    this.state = 'loading';
    this.editor.isEditable = false;

    let s = this.hasura.requestForCoaching(this.value).subscribe({
      next: (data) => {
        this.state = 'done';
        
        setTimeout(() => this.editor?.render(), 0)
        this.editor.isEditable = false;
      },
      error: (err) => {
         console.log('err', err);
      }
    })

    this.subscriptions.push(s);
  }
}
