import { Component, EventEmitter, Input, Output } from '@angular/core';

export type Choice = {
  id: string,
  title: string,
  descriptionHTML: string,
  imageUrl: string
}

@Component({
  selector: 'app-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.sass']
})
export class MultipleChoiceQuestionComponent {

  @Input()
  choices : Choice[] = [
    {
      id: '1',
      title: 'The Up-and-Comer',
      descriptionHTML: 'I feel like <span class="text-red-700">a <u>beginner</u> in a new field</span> and I\'m struggling to adapt and learn skills',
      imageUrl: '/assets/2-a.webp'
    },
    {
      id: '2',
      title: 'The Self-Directed Learner',
      descriptionHTML: 'I feel <span class="text-red-700"><u>overwhelmed</u> by the vast amount of information available</span> and I\'m unsure of which resources to trust and follow',
      imageUrl: '/assets/8-a.webp'
    }, 
    {
      id: '3',
      title: 'Both',
      descriptionHTML: 'Both',
      imageUrl: '/assets/16-a.webp'
    }, 
    {
      id: '4',
      title: 'Neither',
      descriptionHTML: 'Neither',
      imageUrl: '/assets/1-a.webp'
    }, 
  ]

  @Input()
  subtitle: string = '';
  
  @Input()
  questionTitle: string = '';

  @Output('onSelectAnswer')
  onSelectAnswer: EventEmitter<Choice> = new EventEmitter();

  selectAnswer(choiceID: string) {
    let answer = this.choices.find(c => c.id === choiceID);
    if (answer) {
      this.onSelectAnswer.emit(answer);
    }
  }
}
