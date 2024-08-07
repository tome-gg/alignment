import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {
    path: "canvas",
    loadChildren: () => import('./canvas/canvas.module').then(m => m.CanvasModule),
    title: 'Mentorship Canvas - Tome.gg'
  },
  {
    path: "repo",
    loadChildren: () => import('./repository/repository.module').then(m => m.RepositoryModule),
    title: 'Growth Journal - Tome.gg'
  },
  {
    path: "ink",
    loadChildren: () => import('./ink/ink.module').then(m => m.InkModule),
    canActivate: [authGuard],
    title: 'Ink AI - Tome.gg'
  },
  {
    path: "",
    component: OverviewComponent,
    children: [
      {
        path: "",
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        title: 'Tome.gg'
      },
      {
        path: "new",
        loadChildren: () => import('./library/library.module').then(m => m.LibraryModule),
        title: 'Library Highlights - Tome.gg'
      },
      {
        path: "alignment",
        loadChildren: () => import('./alignment/alignment.module').then(m => m.AlignmentModule),
        title: 'Alignment Negotiation - Tome.gg'
      },
      {
        path: "discovery",
        loadChildren: () => import('./discovery/discovery.module').then(m => m.DiscoveryModule),
        title: 'Discovery - Tome.gg'
      },
      {
        path: "mentorship",
        loadChildren: () => import('./mentorship/mentorship.module').then(m => m.MentorshipModule),
        title: 'Mentorship - Tome.gg'
      },
      {
        path: "changes",
        loadChildren: () => import('./change-summary/change-summary.module').then(m => m.ChangeSummaryModule),
        title: 'Changes - Alignment Negotiation - Tome.gg'
      },
      {
        path: "services",
        loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
        title: 'Services - Tome.gg'
      },  
      {
        path: "resources",
        loadChildren: () => import('./resources/resources.module').then(m => m.ResourcesModule),
        title: 'Resources - Tome.gg'
      }, 
      {
        path: "pricing",
        loadChildren: () => import('./docs/pricing/pricing.module').then(m => m.PricingModule),
        title: 'Pricing - Tome.gg'
      },
      {
        path: "services/1-on-1-coaching",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Services: 1-on-1 coaching - Tome.gg'
      }, 
      {
        path: "services/group-coaching",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Services: Group coaching - Tome.gg'
      }, 
      {
        path: "services/rapid-coaching",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Services: Rapid coaching - Tome.gg'
      }, 
      {
        path: "services/interactive-case-studies",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Services: Interactive Case Studies - Tome.gg'
      }, 
      {
        path: "services/directions-discovery",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Services: Directions and Discovery - Tome.gg'
      }, 
      {
        path: "brand",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Branding Guidelines - Tome.gg'
      }, 
      {
        path: "careers",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Careers - Tome.gg'
      }, 
      {
        path: "docs/apply-as-mentor",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Apply as a Mentor - Tome.gg'
      }, 
      {
        path: "docs/affiliate-partners",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Affiliate Program - Tome.gg'
      }, 
      {
        path: "contact-us",
        loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule),
        title: 'Contact Us - Tome.gg'
      }, 
      {
        path: "privacy-policy",
        loadChildren: () => import('./privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
        title: 'Privacy Policy - Tome.gg'
      }, 
      {
        path: "licensing",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Licensing - Tome.gg'
      }, 
      {
        path: "terms-and-conditions",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Terms and Conditions - Tome.gg'
      }, 
      {
        path: "docs/refund-policy",
        loadChildren: () => import('./refund-policy/refund-policy.module').then(m => m.RefundPolicyModule),
        title: 'Refund Policy - Tome.gg'
      },
      {
        path: "docs/about",
        loadChildren: () => import('./docs/company/company.module').then(m => m.CompanyModule),
        title: 'About Us - Tome.gg'
      },
      {
        path: "docs/founder",
        loadChildren: () => import('./docs/founder/founder.module').then(m => m.FounderModule),
        title: 'The Founder - Tome.gg'
      }, 
      {
        path: "docs/challenges",
        loadChildren: () => import('./docs/challenges/challenges.module').then(m => m.ChallengesModule),
        title: 'Common Challenges - Tome.gg'
      }, 
      {
        path: "docs/hiring",
        loadComponent: () => import('./docs/hiring/hiring.component').then(m => m.HiringComponent),
        title: 'Hiring - Tome.gg'
      }, 
      {
        path: "docs/why-choose-us",
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.PageMaintenanceModule),
        title: 'Why Choose Us - Tome.gg'
      }, 
      {
        path: "docs/onboarding",
        loadChildren: () => import('./onboarding/onboarding.module').then(m => m.PageOnboardingModule),
        title: 'Onboarding - Tome.gg'
      }, 
      {
        path: "docs/how-we-work",
        loadComponent: () => import('./docs/how-we-work/how-we-work.component').then(m => m.HowWeWorkComponent),
        title: 'How We Work - Tome.gg'
      }, 
      {
        path: "docs/learning-outcomes",
        loadComponent: () => import('./docs/learning-outcomes/learning-outcomes.component').then(m => m.LearningOutcomesComponent),
        title: 'Learning Outcomes - Tome.gg'
      }, 
      {
        path: "docs/onboarding",
        loadChildren: () => import('./onboarding/onboarding.module').then(m => m.PageOnboardingModule),
        title: 'Onboarding - Tome.gg'
      }, 
      {
        path: "journal",
        loadChildren: () => import('./journal/journal.module').then(m => m.JournalModule),
        title: 'Journal - Tome.gg',
        canActivate: [authGuard]
      }, 
      {
        path: "**", pathMatch: "full", loadChildren: () => import('./404/missing404.module').then(m => m.Missing404Module)
      }
    ]
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
