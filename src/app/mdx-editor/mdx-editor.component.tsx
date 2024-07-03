import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import MdxEditor from './MdxEditor';

const containerElementName = 'myReactComponentContainer';

@Component({
  selector: 'app-mdx-editor',
  standalone: true,
  imports: [],
  templateUrl: './mdx-editor.component.html',
  styleUrl: './mdx-editor.component.sass',
  encapsulation: ViewEncapsulation.None
})
export class MdxEditorComponentWrapper {

  @Input() public counter = 10;
  @Output() public componentClick = new EventEmitter<void>();
  containerRef: any;
  root: any;

  constructor() {
    this.handleDivClicked = this.handleDivClicked.bind(this);
  }

  public handleDivClicked() {
    if (this.componentClick) {
      this.componentClick.emit();
      this.render();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
    window.React = React;
  }

  ngOnDestroy() {
    this.root.unmount();
  }

  private render() {
    
    const markdown = `# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

Hello world`;
    const container = document.getElementById('mdx-editor');

    this.root = createRoot(container!); // createRoot(container!) if you use TypeScript
    this.root.render(<div className={'i-am-classy'}>
      <MdxEditor markdown={markdown} />
    </div>);
  }
}
