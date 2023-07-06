import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorshipComponent } from './mentorship.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: MentorshipComponent }
];

@NgModule({
  declarations: [MentorshipComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [MentorshipComponent]
})
export class MentorshipModule { }