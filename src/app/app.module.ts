import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, Meta } from '@angular/platform-browser';

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
import { environment } from 'src/environments/environment';


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
            domain: environment.auth.domain ?? '',
            clientId: environment.auth.clientId ?? '',
            cacheLocation: "localstorage",
            authorizationParams: {
                redirect_uri: window.location.origin,
                audience: environment.hasura.graphql ?? '',
                scope: 'profile email'
            },
            useRefreshTokens: true,
            httpInterceptor: {
                allowedList: [
                    {
                        uri: environment.hasura.api ?? '',
                        allowAnonymous: true,
                        tokenOptions: {
                            authorizationParams: {
                                // The attached token should target this audience
                                audience: environment.hasura.graphql ?? '',
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
            Meta,
            { provide: HasuraService },
            { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
            {
                provide: APOLLO_OPTIONS,
                useFactory(httpLink: HttpLink, authService: AuthService) {
                    const http = httpLink.create({ uri: environment.hasura.graphql ?? '' });

                    const ws = new WebSocketLink({
                        uri: environment.hasura.wss ?? '',
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
