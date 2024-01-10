import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrowthInventoryComponent } from './growth-inventory.component';
import { MultipleChoiceQuestionModule } from '../multiple-choice-question/multiple-choice-question.module';

@NgModule({
  declarations: [GrowthInventoryComponent],
  imports: [
    CommonModule,
    MultipleChoiceQuestionModule,
  ],
  exports: [GrowthInventoryComponent]
})
export class GrowthInventoryModule { }