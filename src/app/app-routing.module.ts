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
      {
        path: "resources",
        loadChildren: () => import('./resources/resources.module').then(m => m.ResourcesModule)
      }, 
      {
        path: "pricing",
        loadChildren: () => import('./docs/pricing/pricing.module').then(m => m.PricingModule)
      },
      {
        path: "docs/about",
        loadChildren: () => import('./docs/company/company.module').then(m => m.CompanyModule)
      }, 
      {
        path: "docs/refund-policy",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      },
      {
        path: "services/1-on-1-coaching",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "services/group-coaching",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "services/rapid-coaching",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "services/interactive-case-studies",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "services/directions-discovery",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "brand",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "careers",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "contact-us",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "privacy-policy",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "licensing",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "terms-and-conditions",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "docs/about",
        loadChildren: () => import('./docs/company/company.module').then(m => m.CompanyModule)
      }, 
      {
        path: "docs/why-choose-us",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "docs/learning-outcomes",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule)
      }, 
      {
        path: "**", pathMatch: "full", loadChildren: () => import('./404/missing404.module').then(m => m.Missing404Module)
      }
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
