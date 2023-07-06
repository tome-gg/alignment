import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesComponent } from './services.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ServicesComponent }
];

@NgModule({
  declarations: [ServicesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ServicesComponent]
})
export class ServicesModule { }