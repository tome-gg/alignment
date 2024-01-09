import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainingComponent } from './training/training.component';
import { OverviewComponent } from './overview/overview.component';
import { CommonModule, NgIf } from '@angular/common';
import { AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { CtaAccelerateYourGrowthModule } from './cta-accelerate-your-growth/cta-accelerate-your-growth.module';

@NgModule({
  declarations: [
    AppComponent,
    TrainingComponent,
    OverviewComponent,
    AuthButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-hhqarv2odubqjclm.us.auth0.com',
      clientId: '5qJ8mQjcqUeXX8Jue3O70w10J7fkQFTS',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
    NgIf,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
