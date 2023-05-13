import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlignmentComponent } from './alignment/alignment.component';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';
import { OverviewComponent } from './overview/overview.component';
import { RepositoryComponent } from './repository/repository.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: "",
    component: OverviewComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "alignment",
        component: AlignmentComponent
      },
      {
        path: "changes",
        component: ChangeSummaryComponent
      },
      
    ]
  },
  {
    path: "repo",
    component: RepositoryComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
