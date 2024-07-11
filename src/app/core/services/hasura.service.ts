import { catchError, concatMap, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Import the HttpClient for making API requests
import { HttpClient } from '@angular/common/http';

// Import AuthService from the Auth0 Angular SDK to get access to the user
import { AuthService } from '@auth0/auth0-angular';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

@Injectable()
export class HasuraService {

  userId : Subject<String> = new Subject();

  constructor(
    public auth: AuthService,
    private apollo: Apollo,
    ) {

    }


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

  getJournalUser(): Observable<{ id: string, external_id: string}> {
    const MY_QUERY = gql`
  query GetJournalUser {
    journal_users {
      id
      external_id
    }
  }
      `

      return this.apollo.query({
        query: MY_QUERY,
      }).pipe(
        map((result) => (result.data as any).journal_users[0] ?? {}),
        catchError(() => of({} as any))
      );
  }

messageInk(conversationId: string, message: string): Observable<any> {
  const MY_MUTATION = gql`
  mutation SendMessageToInk ($conversation_id: uuid!, $message:String!) {
    message_ink(request: {
      conversation_id: $conversation_id,
      message: $message
    })
    {
      conversation_id
      message
    }
  }`

  return this.apollo.mutate({
    mutation: MY_MUTATION,
    variables: {
      conversation_id: conversationId,
      message: message
    }
  }).pipe(
    map((result) => (result.data as any).message_ink.__typename),
    catchError(() => of({} as any))
  );
}

getInkConversation(): Observable<any> {
  const MY_QUERY = gql`
query GetInkConversation {
  ink_conversations(
    limit: 1
    order_by: {created_at: desc}
  ) {
    id
    title
    owner_id
    metadata
    messages (order_by: {created_at: asc}) {
      id
      author_id
      message
      mentor_read
      apprentice_read
      ai_read
      conversation_id
      type
      created_at
      updated_at
      deleted_at
    }
    created_at
    updated_at
    deleted_at
  }
}
  `

  return this.apollo.query({
    query: MY_QUERY,
    variables: {}
  }).pipe(
    map((result) => (result.data as any).ink_conversations[0] ?? {}),
    catchError(() => of({} as any))
  );
}

getCurrentRequestForCoaching(): Observable<any> {
  const MY_QUERY = gql`
query GetCurrentRequestForCoaching {
  journal_journals {
    id
    owner_id
    title
    active_mentor_id
    entries {
      id
      entry_type
      contents
      metadata
      created_at
      updated_at
    }
    created_at
    updated_at
    deleted_at
  }
}
  `
  const getEntries$ = this.apollo.query<any>({
    query: MY_QUERY,
    variables: {}
  });

  return getEntries$.pipe(map((e) => {
    const latestEntry = e.data.journal_journals[0]?.entries[0];
    if (!latestEntry) {
      throw Error('missing journal entry');
    }
    return latestEntry
  }))
}

requestForCoaching(content: String): Observable<any> {
  const MY_QUERY = gql`
mutation RequestForCoaching ($content: String!, $journalUserId: uuid!) {
  insert_journal_entries_one (
    object: {
      contents: $content
      entry_type: raw,
      journal: {
        data: {
          owner_id: $journalUserId
          title: "Request for Coaching"
        },
        on_conflict: {
          constraint: journals_title_owner_id_key
          update_columns: [title]
        }
      },
      sort_id: 0
    },
    on_conflict: {
      constraint: entries_journal_id_sort_id_key
      update_columns: [contents]
    } 
  ) {
    entry_type
    contents
  }
}
  `

  const user$ = this.getJournalUser();

  const insertRequest$ = (journalUserId: string) => this.apollo.mutate({
    mutation: MY_QUERY,
    variables: {
      content,
      journalUserId
    }
  });

  return user$.pipe(
    concatMap((user) => insertRequest$(user.id))
  )
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