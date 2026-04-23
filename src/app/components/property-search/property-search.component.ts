import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PropertyService, PropertyEstimate } from '../../services/property.service';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.scss']
})
export class PropertySearchComponent implements OnInit {
  searchControl = new FormControl('');
  propertyEstimate: PropertyEstimate | null = null;
  isLoading = false;
  showResults = false;
  errorMessage: string | null = null;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {}

  // Handles search button click or Enter key
  searchProperty(): void {
    const address = this.searchControl.value;
    if (!address) return;

    this.isLoading = true;
    this.showResults = false;
    this.errorMessage = null;

    this.propertyService.getPropertyEstimate(address).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.propertyEstimate = result;
        this.showResults = true;
        
        // Store for detail view if needed by other components
        sessionStorage.setItem('propertyData', JSON.stringify(result));
        
        console.log('Valuation received:', result);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'An error occurred during valuation.';
      }
    });
  }

  // Resets the search
  resetSearch(): void {
    this.searchControl.setValue('');
    this.propertyEstimate = null;
    this.showResults = false;
    this.errorMessage = null;
  }

  // Format currency
  formatCurrency(value: number): string {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
