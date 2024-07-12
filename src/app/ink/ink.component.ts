import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { BehaviorSubject, Subscription, map, tap } from 'rxjs';
import { HasuraService } from '../core/services/hasura.service';
import { DateTime } from 'luxon';
import { AuthService } from '@auth0/auth0-angular';
import { Data as SampleData } from './sample'

var gtag = window.gtag;

export type User = {
  username: string
  imageUrl: string
}

export type ChatMessage = {
  id: string
  type: 'user'|'ai'|'ai_thought'|'peer'
  user: User
  message: string
  timestamp: Date
  timestampReadable: string
  timestampRaw: string
}
@Component({
  selector: 'app-ink',
  templateUrl: './ink.component.html',
  styleUrl: './ink.component.sass'
})
export class InkComponent implements OnInit, OnDestroy {
  user: User = {
    imageUrl: 'https://placehold.co/32x32',
    username: 'User name'
  }

  ink: User = {
    imageUrl: 'assets/ink.png',
    username: 'Ink'
  }

  protected chatMessage = signal("");

  username$: BehaviorSubject<string> = new BehaviorSubject("User");

  messages$ = new BehaviorSubject<ChatMessage[]>([]);

  private subscriptions : Subscription[] = [];

  displayAIThoughts: boolean = true;
  
  conversation_id: string = "";
  
  useSampleData: boolean = false;

  constructor(private hasuraService: HasuraService, private authService: AuthService) {
    
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onValueChange(event: any) {
    this.chatMessage.set(event.target.value);
  }

  checkSubmit(event: any) {
    console.log(event);

    if (event.code === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      this.onSubmit();
      this.chatMessage.set("");
      event.preventDefault();
    }
  }

  onSubmit() {

    const message = this.chatMessage()

    gtag('event', 'message', {
      'event_category': 'ink',
      'value': message.length
     });

    let s = this.hasuraService.messageInk(this.conversation_id, this.chatMessage())
      .subscribe({
          next: (v) => {
            console.log(v);
          },
          error: (e) => {
            console.error(e);
          }
        });

    this.subscriptions.push(s);
  }

  parseDate(date: Date): string {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'short',
      }).format(date);
  }

  parseTime(date: Date): string {
    return new Intl.DateTimeFormat('en', {
      timeStyle: 'short',
      }).format(date);
  }

  ngOnInit() {
    if (this.useSampleData) {
      this.messages$.next(SampleData);
    }

    let s = this.authService.user$.pipe(
      map((user) => user?.name || 'User')
    ).subscribe(this.username$);

    this.subscriptions.push(s);

    const conversation$ = this.hasuraService.getInkConversation().pipe(
      tap((c) => {
        this.conversation_id = c.id;
      })
    );

    const determineMessageType = (type: string, message_author: string, conversation_author: string) => {
      if (type === 'thought') {
        return 'ai_thought';
      } 
      
      if (type === 'message') {
        if (message_author === conversation_author) {
          return 'user';
        } else {
          return 'ai';
        }
      }

      return 'user';
    }

    const constructUser = (conversation: any, entry: any) => {
        return ({
        imageUrl: entry.author_id === conversation.owner_id ? this.user.imageUrl : this.ink.imageUrl,
        username: entry.author_id === conversation.owner_id ? this.user.username : this.ink.username
      });
    }

    const messages$ = conversation$.pipe(
      map((conversation : any) => {

        const entryToChatMessage = (entry: any) => {
          const timestamp = DateTime.fromISO(entry.created_at);
          return ({
            ...entry,
            id: entry.id,
            type: determineMessageType(entry.type, entry.author_id, conversation.owner_id),
            user: constructUser(conversation, entry),
            message: entry.message,
            timestamp: timestamp,
            timestampReadable: timestamp.toLocaleString(DateTime.DATETIME_SHORT),
            timestampRaw: entry.created_at
          } as ChatMessage)
        };

        const messages : any[] = conversation.messages || [];

        return messages.map(entryToChatMessage);
      }),
    )

    if (!this.useSampleData) {
      let s = messages$.subscribe({
        next: (messages) => {
          this.messages$.next(messages)
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
          }, 300);
        }
      })
      this.subscriptions.push(s);
    }
  }

  messages: ChatMessage[] = []
  messageIds: string[] = [];

}
