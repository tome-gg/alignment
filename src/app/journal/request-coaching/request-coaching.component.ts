import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import classNames from 'classnames';
import { DateTime, Zone } from 'luxon';
import { catchError, map, of, single, tap } from 'rxjs';
import { HasuraService } from 'src/app/core/services/hasura.service';
import { AppMdxEditor } from 'src/app/mdx-editor/mdx-editor.component';

@Component({
  selector: 'app-request-coaching',
  templateUrl: './request-coaching.component.html',
  styleUrl: './request-coaching.component.sass'
})
export class RequestCoachingComponent implements AfterViewInit {
  
  @ViewChild('journaleditor') editor!: AppMdxEditor;

  value: String = "";

  isEditable = true;

  state: "editing"|"loading"|"done" = "editing";

  markdownContent: string = '';
  original: string = '';
  entry: any;

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
  ngAfterViewInit(): void {

    const defaultText = `
## Top 3 Questions for Aspiring Apprentices

Please answer the following, as these gives us clear information about your motivations and goals.

**What specific skills or areas do you hope to develop through the Tome.gg program?** 

> Your answer
<BR />
**Can you provide an example of a challenging project or task you've worked on, and how you approached it?**

> Your answer

<BR />
**Why do you want to join Tome.gg, and how do you see this program contributing to your career growth?**

> Your answer


    `;

    console.log('editor', this.editor)
    this.hasura.getCurrentRequestForCoaching()
    .pipe(
      tap((data) => {
        this.entry = data;
      }),
      map((data) => {
        return data?.contents;
      }),
      single(),
      catchError(() => of(defaultText))
    )
    .subscribe({
      next: (data: any) => {
        console.log('new data', data)
        this.original = data;
        this.value = data;
        this.markdownContent = data;
        // setTimeout(() => this.editor?.render(), 0)
      }
    })
  }

  setValue(value: String) {
    this.value = value;
  }

  classNames = classNames;

  sendData(){
    
    this.state = 'loading';
    this.editor.isEditable = false;

    this.hasura.requestForCoaching(this.value).subscribe({
      next: (data) => {
        this.state = 'done';
        
        setTimeout(() => this.editor?.render(), 0)
        this.editor.isEditable = false;
      },
      error: (err) => {
         console.log('err', err);
      }
    })
  }
}
