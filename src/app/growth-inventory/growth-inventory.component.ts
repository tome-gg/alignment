import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import content from './growth-inventory.content.json';
import { Choice } from '../multiple-choice-question/multiple-choice-question.component';

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
