import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-price-listing',
  templateUrl: './service-price-listing.component.html',
  styleUrls: ['./service-price-listing.component.sass']
})
export class ServicePriceListingComponent {
  @Input('priceListing') priceListing: ServicePriceListingModel|null = null;
}

export type ServicePriceListingModel = {
  image: String|undefined
  name: String
  description: String
  // Price in USD
  priceLow: number
  // Price in USD
  priceHigh: number
  sessions: number
  sessionsPerMonth: number
  isMultipleSessions: boolean
  durationPerSession: String
  includes: String[]
  coverage: String[]
  sandbox: String[]
  responsibilities: String[]
}