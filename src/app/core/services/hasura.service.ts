import { catchError, concatMap, map } from 'rxjs/operators';

// Import the HttpClient for making API requests
import { HttpClient } from '@angular/common/http';

// Import AuthService from the Auth0 Angular SDK to get access to the user
import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable()
export class HasuraService {

  constructor(
    public auth: AuthService,
    private apollo: Apollo,
    ) {}


getUser(): Observable<{ id: string, external_id: string, email: string}> {
  const MY_QUERY = gql`
query GetUserInfo {
  attunement_users {
    id
    external_id
    email
  }
}

    `

    return this.apollo.query({
      query: MY_QUERY,
    }).pipe(
      map((result) => (result.data as any).attunement_users[0] ?? {}),
      catchError(() => of({} as any))
    );
}

  insert(data: any, id: string, user_id: string|null): Observable<any> {
    const MY_QUERY = gql`
mutation InsertPublicGrowthInventoryAssessment($data: jsonb = "", $public_id: String = "", $type: String, $user_id: uuid) {
  insert_attunement_growth_inventory(objects: {data: $data, public_id: $public_id, type: $type, user_id: $user_id}) {
    affected_rows
    returning {
      public_id
      created_at
      id
    }
  }
}   
    `

    return this.apollo.mutate({
      mutation: MY_QUERY,
      variables: {
        data: data,
        public_id: id,
        user_id: user_id,
        type: 'growth_inventory_screening'
      }
    });
  }

  read(): Observable<any> {

    const MY_QUERY = gql`
    query GetListingOfUser ($user: String!) {
  personal_info: attunement_listing(
    limit: 1
    order_by: {
      user_id: desc_nulls_last
      created_at:desc_nulls_first
    }
    where: {
      user_id: {_eq: $user}
      data: {
        _contains: {
          type: "personal_info"
        }
      }
    }
  ) {
    id
    user_id
    created_at
    data
  }
  search_criteria: attunement_listing(
    limit: 1
    order_by: {
      user_id: desc_nulls_last
      created_at:desc_nulls_first
    }
    where: {
      user_id: {_eq: $user}
      data: {
        _contains: {
          type: "search_criteria"
        }
      }
    }
  ) {
    id
    user_id
    created_at
    data
  }
}`

    const sub$ = this.auth.user$.pipe(
      map((u) => u!.sub),
    );

    const query$ = (sub: string) => this.apollo.query({
      query: MY_QUERY,
      variables: {
        "user": sub
      },
      context: {
        // example of setting the headers with context per operation
        // headers: new HttpHeaders().set('X-Custom-Header', 'custom-value'),
      },
    });

    return sub$.pipe(concatMap((user) => query$(user!)))
    
    // this.auth.user$
    //   .pipe(
    //     concatMap((user) => user)
    //   )
  }
}