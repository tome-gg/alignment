import { Component } from '@angular/core';

type Questions = {
  communications: Question[]
  growth: Question[]
  scenarios: Question[]
}

type Question = {
  question: string
  isRelevant: boolean
}

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.sass']
})
export class DiscoveryComponent {
  questions : Questions = {
    communications: [
      {
        question: 'How comfortable are you in expressing your thoughts in a group setting?',
        isRelevant: false
      },
      {
        question: 'How would you rate your written communication skills?',
        isRelevant: false
      },
      {
        question: 'How often do you find yourself misunderstood in professional conversations?',
        isRelevant: false
      },
      {
        question: 'Have you ever received feedback on your communication style? If so, what was it?',
        isRelevant: false
      },
      {
        question: 'Do you feel you are able to communicate effectively with non-technical colleagues?',
        isRelevant: false
      },
      {
        question: 'How comfortable are you in explaining complex software concepts to a non-technical audience?',
        isRelevant: false
      },
      {
        question: 'Do you feel that you communicate your expectations clearly to your team?',
        isRelevant: false
      },
      {
        question: 'How often do you have to repeat instructions or clarify them to your team members?',
        isRelevant: false
      },
      {
        question: 'Do you find it challenging to give or receive feedback?',
        isRelevant: false
      },
      {
        question: 'How comfortable are you with public speaking or presenting in front of others?',
        isRelevant: false
      },
      {
        question: 'Have you had any conflicts at work due to communication issues?',
        isRelevant: false
      },
      {
        question: 'Do you find it difficult to articulate your ideas during brainstorming or problem-solving sessions?',
        isRelevant: false
      },
      {
        question: 'How do you typically handle discussions where you disagree with the other party?',
        isRelevant: false
      },
      {
        question: 'Have you ever struggled with communicating in a multicultural or diverse team?',
        isRelevant: false
      },
      {
        question: 'How often do you use active listening in your conversations at work?',
        isRelevant: false
      },
    ],
    growth: [],
    scenarios: []
  }
}
