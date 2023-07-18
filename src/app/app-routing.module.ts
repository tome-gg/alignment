import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: "",
    component: OverviewComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: "alignment",
        loadChildren: () => import('./alignment/alignment.module').then(m => m.AlignmentModule)
      },
      {
        path: "changes",
        loadChildren: () => import('./change-summary/change-summary.module').then(m => m.ChangeSummaryModule)
      },
      {
        path: "services",
        loadChildren: () => import('./services/services.module').then(m => m.ServicesModule)
      },   
    ]
  },
  {
    path: "canvas",
    loadChildren: () => import('./canvas/canvas.module').then(m => m.CanvasModule)
  },
  {
    path: "repo",
    loadChildren: () => import('./repository/repository.module').then(m => m.RepositoryModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
