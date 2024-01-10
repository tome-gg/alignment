import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question.component';


@NgModule({
  declarations: [MultipleChoiceQuestionComponent],
  imports: [
    CommonModule,
  ],
  exports: [MultipleChoiceQuestionComponent]
})
export class MultipleChoiceQuestionModule { }