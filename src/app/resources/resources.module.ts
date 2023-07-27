import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesComponent } from './resources.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ResourcesComponent }
];

@NgModule({
  declarations: [ResourcesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ResourcesComponent]
})
export class ResourcesModule { }