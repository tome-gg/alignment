import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import content from './growth-inventory.content.json';
import { Choice } from '../multiple-choice-question/multiple-choice-question.component';

var CryptoJS: any;

export type Question = {
  title: string
  subtitle: string
  metadata: {
    chatIntro: string
    chatOutro: string
  }
  choices: Choice[]
}

export type Survey = {
  name: string
  questions: Question[]
}

console.log(content.questions);

@Component({
  selector: 'app-growth-inventory',
  templateUrl: './growth-inventory.component.html',
  styleUrls: ['./growth-inventory.component.sass']
})
export class GrowthInventoryComponent implements OnInit {
  questions : Question[] = [];
  answers: Choice[] = [];
  pageState : 'question'|'loading'|'completed' = 'question';
  currentQuestionIndex: number = 0;
  

  @Output()
  onComplete: EventEmitter<Choice[]> = new EventEmitter();

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  selectAnswer(choice: Choice) {
    if (this.currentQuestionIndex === 0 && document.cookie.includes('assessmentStart') === false) {
      document.cookie = "assessmentStart=" + new Date().toISOString() + ";max-age=" + 60*60*24*180 + ";path=/;Secure"; // 180 days expiration
      document.cookie = "assessmentId=" + generateHash() + ";max-age=" + 60*60*24*180 + ";path=/;Secure"; // 180 days expiration
    }
    if (document.cookie.includes('assessmentEarliest') === false) {
      document.cookie = "assessmentEarliest=" + new Date().toISOString() + ";max-age=" + 60*60*24*180 + ";path=/;Secure"; // 180 days expiration
    }
    

    if (this.currentQuestionIndex > this.questions.length) {
      return;
    }

    this.answers.push(choice);
    this.pageState = 'loading';

    setTimeout(() => {
      document.getElementById("growth-inventory")!.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 0);

    setTimeout(() => {
      this.pageState = 'question';
      this.currentQuestionIndex += 1;
      
      if (this.currentQuestionIndex >= this.questions.length) {
        this.pageState = 'completed';
        this.onComplete.emit(this.answers);
      }
    }, 3000);
  }

  ngOnInit() {
    console.log('ok')
    content.questions.forEach((x) =>this.questions.push(x));
    this.changeDetectorRef.detectChanges();
    console.log(this.questions);
  }

  trackByFn() {

  }
}

async function generateHash() {

    // Current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

  try {
    
    // Random string generation
    const randomString = Array(10).fill(null).map(() => Math.random().toString(36).charAt(2)).join('');

    // Encoding the string into an array of bytes
    const msgBuffer = new TextEncoder().encode(randomString);

    // Hashing the data
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert the buffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Shortening the hash to 10 characters and combining with date
    return `${currentDate}-${hashHex.substring(0, 10)}`;

  } catch (e) {
    return `${currentDate}-http`;
  }
}