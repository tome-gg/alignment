import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InkComponent } from './ink.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: InkComponent }
];

@NgModule({
  declarations: [InkComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [InkComponent]
})
export class InkModule { }