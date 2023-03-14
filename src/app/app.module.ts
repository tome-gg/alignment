import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlignmentComponent } from './alignment/alignment.component';
import { TrainingComponent } from './training/training.component';
import { OverviewComponent } from './overview/overview.component';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';
import { TermAndProtocolSelectorComponent } from './alignment/term-and-protocol-selector/term-and-protocol-selector.component';
import { ParametersSelectorComponent } from './alignment/parameters-selector/parameters-selector.component';
import { StakesSelectorComponent } from './alignment/stakes-selector/stakes-selector.component';
import { SummaryCardComponent } from './alignment/summary-card/summary-card.component';
import { MentoringObjectiveCardComponent } from './alignment/mentoring-objective-card/mentoring-objective-card.component';
import { StateSelectorComponent } from './state-selector/state-selector.component';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

@NgModule({
  declarations: [
    AppComponent,
    AlignmentComponent,
    TrainingComponent,
    OverviewComponent,
    ChangeSummaryComponent,
    TermAndProtocolSelectorComponent,
    ParametersSelectorComponent,
    StakesSelectorComponent,
    SummaryCardComponent,
    MentoringObjectiveCardComponent,
    StateSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGoogleAnalyticsModule.forRoot('G-9P755HMHC8'),
    NgxGoogleAnalyticsRouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
