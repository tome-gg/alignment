import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as React from 'react';

import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import MdxEditor from './MdxEditor';

const containerElementName = 'myReactComponentContainer';

@Component({
  selector: 'app-mdx-editor',
  templateUrl: './mdx-editor.component.html',
  styleUrl: './mdx-editor.component.sass',
  encapsulation: ViewEncapsulation.None
})
export class AppMdxEditor implements OnChanges {

  @Input() public value : string = "";
  @Input() public isEditable = true;
  @Input() public original : string = "";
  @Input() public state : "edit"|"view" = "edit";
  @Output() public onValueChange = new EventEmitter<String>();
  
  containerRef: any;
  root: any;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.value === '') return;
    this.render();
  }

  ngAfterViewInit() {
    // this.render();
    window.React = React;
  }

  ngOnDestroy() {
    this.root.unmount();
  }

  render() {
    
    const onChange = (value: string) => {
      this.onValueChange.emit(value);
    };

    if (this.root === undefined) {
      const container = document.getElementById('mdx-editor');
      this.root = createRoot(container!);
    }

    setTimeout(() => {
      this.root.render(<div className={'mdx-editor'}>
        <MdxEditor originalContent={this.original} readOnly={!this.isEditable} onChange={onChange} markdown={this.value} />
      </div>);
    }, 0)
  }
}
