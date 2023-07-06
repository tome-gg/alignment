import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositoryComponent } from './repository.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: RepositoryComponent }
];

@NgModule({
  declarations: [RepositoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RepositoryComponent]
})
export class RepositoryModule { }