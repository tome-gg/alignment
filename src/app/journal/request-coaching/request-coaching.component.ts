import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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

  isSent = false;

  isEditable = true;

  markdownContent: string;
  original: string;

  constructor(private hasura: HasuraService) {
    this.original = `## Mentorship program application

### Prerequisites

* [ ] I have already read the onboarding process on Tome.gg.

### Professional Experience

* [ ] Software engineer
* [ ] I have already read the onboarding process on Tome.gg.
* [ ] I have already read the onboarding process on Tome.gg.
* [ ] I have already read the onboarding process on Tome.gg.
* [ ] I have already read the onboarding process on Tome.gg.
* [ ] I have already read the onboarding process on Tome.gg.

`
    this.markdownContent = this.original;
  }
  ngAfterViewInit(): void {
    console.log('editor', this.editor)
  }

  setValue(value: String) {
    this.value = value;
  }

  sendData(){
    
    this.isSent = true;
    console.log('editor', this.editor)
    this.editor.isEditable = false;
    
    this.editor?.render()

  //   this.hasura.requestForCoaching(this.value).subscribe({
  //     next: (data) => {
  //       this.isSent = true;
  //       console.log('editor', this.editor)
  //       this.editor?.render()
  //       console.log('next', data);
  //     },
  //     error: (err) => {
  //        console.log('err', err);
  //     }
  //   })
  }
}
