import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorshipComponent } from './mentorship.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "introduction",
    loadChildren: () => import('../home/home.module').then(m => m.HomeModule),
    title: 'Craft your Tome of Knowledge - Tome.gg'
  },
  { path: 'start', component: MentorshipComponent }
];

@NgModule({
  declarations: [MentorshipComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [MentorshipComponent]
})
export class MentorshipModule { }