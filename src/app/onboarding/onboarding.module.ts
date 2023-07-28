import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageOnboardingComponent } from './onboarding.component';
import { PageQualificationsComponent } from './qualifications.component';
import { RouterModule, Routes } from '@angular/router';
import { PageBookingComponent } from './booking.component';

const routes: Routes = [
  { path: '', component: PageOnboardingComponent },
  { path: 'qualifications', component: PageQualificationsComponent },
  { path: 'booking', component: PageBookingComponent }
];

@NgModule({
  declarations: [PageOnboardingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [PageOnboardingComponent]
})
export class PageOnboardingModule { }