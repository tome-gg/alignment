import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company.component';
import { RouterModule, Routes } from '@angular/router';
import { CtaAccelerateYourGrowthModule } from 'src/app/cta-accelerate-your-growth/cta-accelerate-your-growth.module';

const routes: Routes = [
  { path: '', component: CompanyComponent }
];

@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    CtaAccelerateYourGrowthModule,
    RouterModule.forChild(routes)
  ],
  exports: [CompanyComponent]
})
export class CompanyModule { }