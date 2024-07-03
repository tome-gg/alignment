import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RequestCoachingComponent } from './request-coaching/request-coaching.component';
import { AppMdxEditor as AppMdxEditorComponent } from '../mdx-editor/mdx-editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'request-coaching', pathMatch: 'full' },
  { path: 'request-coaching', component: RequestCoachingComponent },
];

@NgModule({
  declarations: [RequestCoachingComponent, AppMdxEditorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RequestCoachingComponent]
})
export class JournalModule { }