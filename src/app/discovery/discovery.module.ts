import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscoveryComponent } from './discovery.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: DiscoveryComponent }
];

@NgModule({
  declarations: [DiscoveryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [DiscoveryComponent]
})
export class DiscoveryModule { }