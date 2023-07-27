import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingComponent } from './pricing.component';
import { RouterModule, Routes } from '@angular/router';
import { ServicePriceListingComponent } from '../service-price-listing/service-price-listing.component';

const routes: Routes = [
  { path: '', component: PricingComponent }
];

@NgModule({
  declarations: [PricingComponent, ServicePriceListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [PricingComponent]
})
export class PricingModule { }