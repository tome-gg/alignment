import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlignmentComponent } from './alignment/alignment.component';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: "alignment",
    component: AlignmentComponent
  },
  {
    path: "",
    component: OverviewComponent
  },
  {
    path: "changes",
    component: ChangeSummaryComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
