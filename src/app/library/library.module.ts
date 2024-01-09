import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { RouterModule, Routes } from '@angular/router';
import { MultipleChoiceQuestionComponent } from '../multiple-choice-question/multiple-choice-question.component';
import { CtaAccelerateYourGrowthModule } from '../cta-accelerate-your-growth/cta-accelerate-your-growth.module';

const routes: Routes = [
  { path: '', component: LibraryComponent }
];

@NgModule({
  declarations: [LibraryComponent, MultipleChoiceQuestionComponent],
  imports: [
    CommonModule,
    CtaAccelerateYourGrowthModule,
    RouterModule.forChild(routes),
  ],
  exports: [LibraryComponent]
})
export class LibraryModule { }