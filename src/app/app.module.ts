import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrainingComponent } from './training/training.component';
import { OverviewComponent } from './overview/overview.component';
import { CommonModule, NgIf } from '@angular/common';
import { AuthHttpInterceptor, AuthModule, AuthService } from '@auth0/auth0-angular';
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HasuraService } from './core/services/hasura.service';
import * as Sentry from "@sentry/angular";
import { Router } from '@angular/router';
import { getMainDefinition } from '@apollo/client/utilities';
import { firstValueFrom } from 'rxjs';

@NgModule({ declarations: [
        AppComponent,
        TrainingComponent,
        OverviewComponent,
        AuthButtonComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        CommonModule,
        // Import the module into the application, with configuration
        AuthModule.forRoot({
            domain: 'dev-phh2u7lm3h45n2fy.us.auth0.com',
            clientId: 'xOWUb7eGFmKmdCobWEcpGswGEI87EL84',
            cacheLocation: "localstorage",
            authorizationParams: {
                redirect_uri: window.location.origin,
                audience: 'https://hasura.tome.gg/v1/graphql',
                scope: 'profile email'
            },
            useRefreshTokens: true,
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
        GraphQLModule], 
        providers: [
            { provide: HasuraService },
            { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
            {
                provide: APOLLO_OPTIONS,
                useFactory(httpLink: HttpLink, authService: AuthService) {
                    const http = httpLink.create({ uri: 'https://hasura.tome.gg/v1/graphql' });

                    const ws = new WebSocketLink({
                        uri: `wss://hasura.tome.gg/v1/graphql`,
                        options: {
                            reconnect: true,
                            lazy: true,
                            timeout: 30000,
                            inactivityTimeout: 30000,
                            connectionParams: async () => {

                                try {
                                        // Retrieve the authorization token from your auth service
                                    let token = await firstValueFrom(authService.getAccessTokenSilently())
                                    return {
                                        headers: {
                                            Authorization: token ? `Bearer ${token}` : '',
                                        },
                                    };
                                } catch (error) {
                                    console.error('Error getting access token:', error);
                                }
                                return {}
                            },
                        },
                    });
                    
                    console.log('configuring apollo link');

                    const link = split(
                    ({ query }) => {
                        const definition = getMainDefinition(query);
                        return (
                        definition.kind === 'OperationDefinition' &&
                        definition.operation === 'subscription'
                        );
                    },
                    ws,
                    http
                    );

                    return {
                    link: link,
                    cache: new InMemoryCache(),
                    };
                },
                deps: [HttpLink, AuthService],
            },
            {
                provide: ErrorHandler,
                useValue: Sentry.createErrorHandler({
                showDialog: true,
            }),
            }, {
                provide: Sentry.TraceService,
                deps: [Router],
            },
            provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
