import { Component, OnInit } from '@angular/core';
import { Observable, filter, interval, map } from 'rxjs';

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
export class InkComponent implements OnInit {
  user: User = {
    imageUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg',
    username: 'Patient Grasshopper'
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

  ngOnInit() {
    // How long before each message is sent over
    const delayInSec = 4;

    const messages$ = interval(delayInSec * 1000).pipe(
      map((_, idx) => this.allMessages[idx]),
      filter((v) => v !== null && v !== undefined)
    );

    (messages$ as Observable<ChatMessage>).subscribe((msg) => this.messages.push(msg));
  }

  messages: ChatMessage[] = []

  allMessages: (ChatMessage|null)[] = [
    null,
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
      message: `The person is interested to transition into tech, but is uncertain about how to proceed. Useful information to provide might be learning resources, or roadmaps.`,
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    null,
    {
      id: '4',
      type: 'peer',
      user: {
        imageUrl: this.user.imageUrl,
        username: 'Darren'
      },
      message: `Hi ` + this.user.username + `, nice to meet  you! I'm Darren, a mentor in Tome.gg. I highly recommend you check out <a class='link cursor' href='https://roadmap.sh'>Roadmap.sh</a> which provides some guidance and options for career paths in tech.`,
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    {
      id: '5',
      type: 'ai_thought',
      user: this.ink,
      message: `This demo illustrates the interactions between a AI copilot (Ink), a coach or a peer (Darren), and you, a learner (in this case: ` + this.user.username + `).`,
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    null,
    null,
    {
      id: '6',
      type: 'ai',
      user: this.ink,
      message: `As the AI learning copilot, I will help prompt you, ask you questions, support you, and bridge the connection and information gap between you and your mentor, as well as bridge the information gap between what you want to learn and the resources on the internet.`,
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    null,
    {
      id: '7',
      type: 'ai',
      user: this.ink,
      message: `As you continue to learn, I will generate uniquely personalized learning roadmaps for you, such as ones found in <a class='cursor link' href='https://map.tome.gg'>Tome.gg's Adaptive Map</a>.`,
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    null,
    null,
    {
      id: '8',
      type: 'user',
      user: this.user,
      message: 'Okay, this looks very promising. When will Ink be available?',
      timestamp: new Date(),
      timestampRaw: 'now'
    },
    {
      id: '9',
      type: 'ai',
      user: this.ink,
      message: `I'm glad to hear that! We can inform you when I'm ready if you <a class='cursor link' href='https://waitlist.tome.gg/ink'>join the waitlist</a> for Ink.`,
      timestamp: new Date(),
      timestampRaw: 'now'
    },
  ]

}
