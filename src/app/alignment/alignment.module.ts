import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlignmentComponent } from './alignment.component';
import { RouterModule, Routes } from '@angular/router';
import { TermAndProtocolSelectorComponent } from './term-and-protocol-selector/term-and-protocol-selector.component';
import { ParametersSelectorComponent } from './parameters-selector/parameters-selector.component';
import { StakesSelectorComponent } from './stakes-selector/stakes-selector.component';
import { SummaryCardComponent } from './summary-card/summary-card.component';
import { MentoringObjectiveCardComponent } from './mentoring-objective-card/mentoring-objective-card.component';
import { StateSelectorComponent } from '../state-selector/state-selector.component';

const routes: Routes = [
  { path: '', component: AlignmentComponent }
];

@NgModule({
  declarations: [
    AlignmentComponent,
    TermAndProtocolSelectorComponent,
    ParametersSelectorComponent,
    StakesSelectorComponent,
    MentoringObjectiveCardComponent,
    SummaryCardComponent,
    StateSelectorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [AlignmentComponent]
})
export class AlignmentModule { }