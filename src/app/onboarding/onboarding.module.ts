import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageOnboardingComponent } from './onboarding.component';
import { PageQualificationsComponent } from './qualifications.component';
import { RouterModule, Routes } from '@angular/router';
import { PageBookingComponent } from './booking.component';
import { MultipleChoiceQuestionModule } from '../multiple-choice-question/multiple-choice-question.module';
import { GrowthInventoryModule } from '../growth-inventory/growth-inventory.module';

const routes: Routes = [
  { path: '', component: PageOnboardingComponent },
  { path: 'qualifications', component: PageQualificationsComponent },
  { path: 'booking', component: PageBookingComponent }
];

@NgModule({
  declarations: [PageOnboardingComponent],
  imports: [
    CommonModule,
    MultipleChoiceQuestionModule,
    GrowthInventoryModule,
    RouterModule.forChild(routes)
  ],
  exports: [PageOnboardingComponent]
})
export class PageOnboardingModule { }