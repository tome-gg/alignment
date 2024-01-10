import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import content from './growth-inventory.content.json';
import { Choice } from '../multiple-choice-question/multiple-choice-question.component';

export type Question = {
  title: string
  subtitle: string
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

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    
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
