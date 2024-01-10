import { Component } from '@angular/core';
import { Choice } from '../multiple-choice-question/multiple-choice-question.component';

@Component({
  selector: 'app-growth-inventory',
  templateUrl: './growth-inventory.component.html',
  styleUrls: ['./growth-inventory.component.sass']
})
export class GrowthInventoryComponent {
  choices_one: Choice[] = [
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

  choices_two: Choice[] = [
    {
      id: '5',
      title: 'TEST 2',
      descriptionHTML: 'I feel like <span class="text-red-700">a <u>beginner</u> in a new field</span> and I\'m struggling to adapt and learn skills',
      imageUrl: '/assets/2-a.webp'
    },
    {
      id: '6',
      title: 'TEST 3',
      descriptionHTML: 'I feel <span class="text-red-700"><u>overwhelmed</u> by the vast amount of information available</span> and I\'m unsure of which resources to trust and follow',
      imageUrl: '/assets/8-a.webp'
    }, 
    {
      id: '7',
      title: 'Both',
      descriptionHTML: 'Both',
      imageUrl: '/assets/16-a.webp'
    }, 
    {
      id: '8',
      title: 'Neither',
      descriptionHTML: 'Neither',
      imageUrl: '/assets/1-a.webp'
    }, 
  ]
}
