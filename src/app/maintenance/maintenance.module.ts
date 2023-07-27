import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageMaintenanceComponent } from './maintenance.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PageMaintenanceComponent }
];

@NgModule({
  declarations: [PageMaintenanceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [PageMaintenanceComponent]
})
export class PageMaintenanceModule { }