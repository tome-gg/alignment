import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { RouterModule, Routes } from '@angular/router';
import { CtaAccelerateYourGrowthModule } from '../cta-accelerate-your-growth/cta-accelerate-your-growth.module';
import { MultipleChoiceQuestionModule } from '../multiple-choice-question/multiple-choice-question.module';

const routes: Routes = [
  { path: '', component: LibraryComponent }
];

@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule,
    CtaAccelerateYourGrowthModule,
    MultipleChoiceQuestionModule,
    RouterModule.forChild(routes),
  ],
  exports: [LibraryComponent]
})
export class LibraryModule { }