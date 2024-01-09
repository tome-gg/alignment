import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountabilityServiceComponent, GroupServiceComponent, InteractiveCaseStudiesComponent, OneOnOneServiceComponent, RapidServiceComponent } from './services.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '1-on-1-coaching', component: OneOnOneServiceComponent },
  { path: 'group-coaching', component: GroupServiceComponent },
  { path: 'accountability', component: AccountabilityServiceComponent },
  { path: 'rapid-coaching', component: RapidServiceComponent },
  { path: 'interactive-case-studies', component: InteractiveCaseStudiesComponent }
];

@NgModule({
  declarations: [OneOnOneServiceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [OneOnOneServiceComponent]
})
export class ServicesModule { }