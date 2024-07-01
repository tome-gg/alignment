import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesComponent } from './challenges.component';
import { RouterModule, Routes } from '@angular/router';
import { CtaAccelerateYourGrowthModule } from 'src/app/cta-accelerate-your-growth/cta-accelerate-your-growth.module';

const routes: Routes = [
  { path: '', component: ChallengesComponent }
];

@NgModule({
  declarations: [ChallengesComponent],
  imports: [
    CommonModule,
    CtaAccelerateYourGrowthModule,
    RouterModule.forChild(routes)
  ],
  exports: [ChallengesComponent]
})
export class ChallengesModule { }