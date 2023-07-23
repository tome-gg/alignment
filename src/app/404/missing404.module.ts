import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Missing404Component } from './missing404.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: Missing404Component }
];

@NgModule({
  declarations: [Missing404Component],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [Missing404Component]
})
export class Missing404Module { }