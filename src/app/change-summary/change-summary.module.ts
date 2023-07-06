import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeSummaryComponent } from './change-summary.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ChangeSummaryComponent }
];

@NgModule({
  declarations: [ChangeSummaryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ChangeSummaryComponent]
})
export class ChangeSummaryModule { }