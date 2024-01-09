import { NgModule } from '@angular/core';
import { ContactUsComponent } from './contact-us.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';


const routes: Routes = [
  { path: '', component: ContactUsComponent }
];

@NgModule({
  declarations: [ContactUsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ContactUsComponent]
})
export class ContactUsModule { }