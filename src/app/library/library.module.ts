import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LibraryComponent }
];

@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [LibraryComponent]
})
export class LibraryModule { }