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

  // Score meter helpers
  getScorePercentage(score: number | undefined): number {
    if (!score) return 0;
    return Math.max(0, Math.min(100, ((score - 300) / 600) * 100));
  }

  getScoreColor(score: number | undefined): string {
    if (!score) return '#949494';
    if (score >= 750) return '#4caf50'; // Green - Excellent
    if (score >= 650) return '#8bc34a'; // Light Green - Good
    if (score >= 550) return '#fbc02d'; // Yellow - Fair
    if (score >= 450) return '#ff9800'; // Orange - Poor
    return '#f44336'; // Red - Very Poor
  }

  getScoreLabel(score: number | undefined): string {
    if (!score) return 'N/A';
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    if (score >= 450) return 'Poor';
    return 'Very Poor';
  }

  getScoreDashoffset(score: number | undefined): number {
    const circumference = 157.08; // pi * radius(50)
    const percentage = this.getScorePercentage(score);
    return circumference - (percentage / 100) * circumference;
  }

  // Helper for keyvalue pipe to maintain original object insertion order
  returnZero() {
    return 0;
  }

  getCategoryScore(items: any[]): number {
    return items.reduce((acc, item) => acc + (item.awarded || 0), 0);
  }

  getCategoryMax(items: any[]): number {
    return items.reduce((acc, item) => acc + (item.max_points || 0), 0);
  }
}
