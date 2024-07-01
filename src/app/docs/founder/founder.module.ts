import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FounderComponent } from './founder.component';
import { RouterModule, Routes } from '@angular/router';
import { CtaAccelerateYourGrowthModule } from 'src/app/cta-accelerate-your-growth/cta-accelerate-your-growth.module';

const routes: Routes = [
  { path: '', component: FounderComponent }
];

@NgModule({
  declarations: [FounderComponent],
  imports: [
    CommonModule,
    CtaAccelerateYourGrowthModule,
    RouterModule.forChild(routes)
  ],
  exports: [FounderComponent]
})
export class FounderModule { }