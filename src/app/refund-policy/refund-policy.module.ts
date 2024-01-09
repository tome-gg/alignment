import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundPolicyComponent } from './refund-policy.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: RefundPolicyComponent }
];

@NgModule({
  declarations: [RefundPolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RefundPolicyComponent]
})
export class RefundPolicyModule { }