import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PropertyEstimate } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  propertyEstimate: PropertyEstimate | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get property data from sessionStorage
    const propertyDataJson = sessionStorage.getItem('propertyData');
    if (propertyDataJson) {
      try {
        this.propertyEstimate = JSON.parse(propertyDataJson);
        // Clear it after use to avoid confusion
        sessionStorage.removeItem('propertyData');
      } catch (e) {
        console.error('Failed to parse property data', e);
      }
    }
  }

  goBack(): void {
    window.history.back();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
