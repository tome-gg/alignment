import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainingComponent } from './training/training.component';
import { OverviewComponent } from './overview/overview.component';
import { CommonModule, NgIf } from '@angular/common';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { HasuraService } from './core/services/hasura.service';

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
    HttpClientModule,
    
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-phh2u7lm3h45n2fy.us.auth0.com',
      clientId: 'xOWUb7eGFmKmdCobWEcpGswGEI87EL84',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://hasura.tome.gg/v1/graphql',
        scope: 'profile email'
      },
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://{yourDomain}/api/v2/' (note the asterisk)
            uri: 'https://hasura.tome.gg/v1/*',
            allowAnonymous: true,
            tokenOptions: {
              authorizationParams: {
                // The attached token should target this audience
                audience: 'https://hasura.tome.gg/v1/graphql',
    
                // The attached token should have these scopes
                scope: 'profile email'
              }
            }
          }
        ]
      }
    }),
    NgIf,
    GraphQLModule,
  ],
  providers: [
    { provide: HasuraService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          // other options
          link: httpLink.create({ uri: 'https://hasura.tome.gg/v1/graphql' }),
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
