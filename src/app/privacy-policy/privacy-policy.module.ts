import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MultipleChoiceQuestionModule } from '../multiple-choice-question/multiple-choice-question.module';
import { GrowthInventoryModule } from '../growth-inventory/growth-inventory.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';

const routes: Routes = [
  { path: '', component: PrivacyPolicyComponent },
];

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    MultipleChoiceQuestionModule,
    GrowthInventoryModule,
    RouterModule.forChild(routes)
  ],
  exports: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule { }