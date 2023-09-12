import { Component } from '@angular/core';
import { ServicePriceListingModel } from '../service-price-listing/service-price-listing.component';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.sass']
})
export class PricingComponent {
  
  coaching_1on1_discovery : ServicePriceListingModel = {
    image: '',
    name: 'Discovery and Directions Deep-dive',
    description: 'You and your mentor work closely together both in-session and out-of-session to map out and explore your current situation accurately. The goal is to understand your environment and your chosen direction more precisely, and uncovering problems and challenges that impede your well-being and accelerated growth.',
    priceLow: 60,
    priceHigh: 120,
    isMultipleSessions: false,
    sessions: 1,
    sessionsPerMonth: 1,
    durationPerSession: '1 hour',
    includes: [
      'Everything included in \'Answering One Question\'',
      'Asynchronous chat access with mentor 2-3 days before the session for further clarification',
      '1 page written report (Google Docs) on the discovery session highlighting observations and assessments',
      '(Optional) Interactive Miro board visualization where you collaborate with your mentor to map out your raw status and direction',
      '(Optional) extension: additional 30 minutes'
    ],
    coverage: [
      'Discovery: Sessions are exploratory and diagnostic in nature; We will discuss your challenges and problems you are currently experiencing',
    ],
    sandbox: [
      'Everything the mentor provides in \'Answering One Question\'',
      'Support: Mentor provides patient and gentle support',
      'Explore: Mentor invites you to understand your challenges and problems more carefully and precisely',
      'Release: Mentor protects a space for you to express your thoughts and feeelings about the problem, or about the conversation/session itself',
      'Observe: Mentor records your raw experiences, feelings, thoughts, problems - for your later self-reflection',
      'Document: Mentor demonstrates effective notetaking and clear information organization',
      'Assess: Mentor spends a portion of the session analyzing the initial research and the session discussion',
    ],
    responsibilities: [
      'Everything you are responsible for in \'Answering One Question\'',
      'Clear setting of your boundaries in the exploratory discussion',
      'Clear setting of your objective for the session',
    ]
  }

  coaching_1on1_discovery_light : ServicePriceListingModel = {
    image: '',
    name: 'Answering One Question',
    description: 'We explore and discuss one specific question that you want to address or resolve.',
    priceLow: 30,
    priceHigh: 45,
    isMultipleSessions: false,
    sessions: 1,
    sessionsPerMonth: 1,
    durationPerSession: '30 minutes',
    includes: [
      'Initial research: A preflight survey questionnaire will act as the starting point for the session',
      '1-page summary report on our session, with highlighted areas from the mentor',
      '(Optional) extension: additional 15 minutes for the session'
    ],
    coverage: [
      'Alignment: Sessions are focused on follow-up questions and clarifications, in pursuit of answering your one question',
    ],
    sandbox: [
      'Prescribe: Mentor asks a variety of questions to provide specific advice or suggestion for your situation',
      'Inform: Mentor provides relevant information to the initial research records your raw experiences, feelings, thoughts, problems',
      'Confront: Mentor highlights a challenge, or a different perspective to your situation',
    ],
    responsibilities: [
      'To articulate what question to explore/answer to the best of your abilities',
      'To submit the survey questionnaire accurately and truthfully 3 days before the booked session',
      'To answers any follow-up questions before the actual session',
      'To focus the conversation and inquiries on the decided scope of discussion',
      'To develop critical self-awareness',
      'To be open to reflection in areas, topics, or truths that you may need to accept, in pursuit of your chosen growth direction',
      'To decide on a commitment for your growth'
    ]
  }
  
  // coaching_1on1_tier_a : ServicePriceListingModel = {
  //   image: '',
  //   name: 'Tier A coaching',
  //   description: 'Have your situation or context reviewed with a specialist\'s depth of experience, expert diagnosis, and critical insights. Suitable for individuals in the polishing to mastery<sup>1</sup> stage.',
  //   price: 1600,
  //   sessions: 8,
  //   sessionsPerMonth: 2,
  //   durationPerSession: '1 hour',
  //   includes: [
  //     'Preflight Alignment and Discovery session (excluded from total sessions)',
  //     'Sessions are agenda-defined, and objective-driven',
  //     'Recorded, private video session so you can focus on learning',
  //     'Asynchronous access to mentor (email, messaging, discord)'
  //   ],
  //   coverage: [
  //     'Feedback on your discipline, focus, consistency',
  //     'Feedback on your understanding and writing',
  //     'Feedback on your technical skill'
  //   ],
  //   sandbox: [
  //     'Mentor is acutely aware of your effective capacity, and adapts their support',
  //     'Mentor demonstrates effective notetaking and clear recording of your growth and progress',
  //     'Mentor celebrates your small wins, no matter how small',
  //     'Mentor assists you in managing your growth performance expectations',
  //   ],
  //   responsibilities: [
  //     'Reading your take-home resource materials',
  //     'Your daily writing of your report to your mentor, recording your growth',
  //     'Active participation in defining what you know and what you don\'t know',
  //     'Generating questions to communicate your current level of understanding',
  //     'No spoonfeeding',
  //   ]
  // }

  // coaching_1on1_tier_b : ServicePriceListingModel = {
  //   image: '',
  //   name: 'Tier B coaching',
  //   description: 'Have your situation or context reviewed with a specialist\'s depth of experience, expert diagnosis, and critical insights. Suitable for individuals in the training and polishing<sup>1</sup> stage.',
  //   price: 1000,
  //   sessions: 8,
  //   sessionsPerMonth: 2,
  //   durationPerSession: '1 hour',
  //   includes: [
  //     'Preflight Alignment and Discovery session (excluded from total sessions)',
  //     'Sessions are agenda-defined, and objective-driven',
  //     'Asynchronous access to mentor (email, messaging, discord)'
  //   ],
  //   coverage: [
  //     'Feedback on your discipline, focus, consistency',
  //     'Feedback on your writing only',
  //     'Feedback on your technical skill'
  //   ],
  //   sandbox: [
  //     'Mentor demonstrates effective notetaking and clear recording of your growth and progress',
  //     'Mentor celebrates your small wins, no matter how small',
  //     'Mentor assists you in managing your growth performance expectations',
  //   ],
  //   responsibilities: [
  //     'Reading your take-home resource materials',
  //     'Your daily writing of your report to your mentor, recording your growth',
  //     'Active participation in defining what you know and what you don\'t know',
  //     'Generating questions to communicate your current level of understanding',
  //     'No spoonfeeding',
  //   ]
  // }

  // coaching_1on1_tier_c : ServicePriceListingModel = {
  //   image: '',
  //   name: 'Tier C coaching',
  //   description: 'Get clear feedback on your consistent training of technical, professional, and communication skills. Suitable for individuals in the training<sup>1</sup> stage.',
  //   price: 680,
  //   sessions: 8,
  //   sessionsPerMonth: 2,
  //   durationPerSession: '1 hour',
  //   includes: [
  //     'Preflight Alignment and Discovery session (excluded from total sessions)',
  //     'Sessions are agenda-defined, and objective-driven',
  //     'Asynchronous access to mentor (email, messaging, discord)'
  //   ],
  //   coverage: [
  //     'Feedback on your discipline, focus, consistency',
  //     'Feedback on your technical skill',
  //   ],
  //   sandbox: [
  //     'Mentor demonstrates effective notetaking and clear recording of your growth and progress',
  //     'Mentor celebrates your small wins, no matter how small',
  //   ],
  //   responsibilities: [
  //     'Reading your take-home resource materials',
  //     'Your daily writing of your report to your mentor, recording your growth',
  //     'Active participation in defining what you know and what you don\'t know',
  //     'Generating questions to communicate your current level of understanding',
  //     'No spoonfeeding',
  //   ]
  // }

  // coaching_1on1_tier_a_rapid : ServicePriceListingModel = {
  //   image: '',
  //   name: 'Tier A coaching (Rapid)',
  //   description: 'Have your situation or context reviewed with a specialist\'s depth of experience, expert diagnosis, and critical insights. Suitable for individuals in the polishing to mastery<sup>1</sup> stage.',
  //   price: 750,
  //   sessions: 16,
  //   sessionsPerMonth: 4,
  //   durationPerSession: '15 minutes',
  //   includes: [
  //     'Preflight Alignment and Discovery session (excluded from total sessions)',
  //     'Sessions are agenda-defined, and objective-driven',
  //     'Asynchronous access to mentor (email, messaging, discord)'
  //   ],
  //   coverage: [
  //     'Feedback on your discipline, focus, consistency',
  //     'Feedback on your technical skill',
  //     'Feedback on your understanding and writing',
  //   ],
  //   sandbox: [
  //     'Mentor focuses the sessions on questions not discussed or resolved in async discussions',
  //   ],
  //   responsibilities: [
  //     'Reading your take-home resource materials',
  //     'Your daily writing of your report to your mentor, recording your growth',
  //     'Active participation in defining what you know and what you don\'t know',
  //     'Generating questions to communicate your current level of understanding',
  //     'No spoonfeeding',
  //   ]
  // }
}
