import { Component } from '@angular/core';

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
  timestampRaw: string
}
@Component({
  selector: 'app-ink',
  templateUrl: './ink.component.html',
  styleUrl: './ink.component.sass'
})
export class InkComponent {
  user: User = {
    imageUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
    username: 'Furry Puppet'
  }

  ink: User = {
    imageUrl: 'assets/ink.png',
    username: 'Ink'
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

  messages: ChatMessage[] = [
    {
      id: '1',
      type: 'user',
      user: this.user,
      message: 'Hello! I am curious about how to get into tech but I am not sure how. I am doing bootcamps right now. Is that okay?',
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    {
      id: '2',
      type: 'ai',
      user: this.ink,
      message: 'Hi there person!',
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    {
      id: '3',
      type: 'ai_thought',
      user: this.ink,
      message: `I hope I didn't spook him.`,
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    {
      id: '4',
      type: 'peer',
      user: {
        imageUrl: this.user.imageUrl,
        username: 'Darren'
      },
      message: `Hi Furry Puppet. I think you're doing great. Don't worry about it.`,
      timestamp: new Date(),
      timestampRaw: 'now'
    }
  ]

}
