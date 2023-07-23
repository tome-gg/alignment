import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: CompanyComponent }
];

@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [CompanyComponent]
})
export class CompanyModule { }