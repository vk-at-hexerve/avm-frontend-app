import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface PropertyEstimate {
  address: string;
  predicted_price_usd: number;
  confidence_interval: {
    low: number;
    high: number;
  };
  confidence_pct: number;
  features_used: number;
  feature_breakdown: any;
  training_method: string;
  comps_used: number;
  comparable_properties: any[];
  target_features: { [key: string]: number };
  neighborhood_features?: { [key: string]: number };
  property_type: string;
  property_sub_type: string;
  property_score?: number;
  score_breakdown?: { [key: string]: any[] };
  model_metrics?: any;
  data_sources_hit?: { [key: string]: boolean };
  warnings?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Fetches property price estimate from the real-time ML backend
   */
  getPropertyEstimate(address: string): Observable<PropertyEstimate> {
    return this.http.post<PropertyEstimate>(`${this.apiUrl}/predict`, { address }).pipe(
      catchError(error => {
        console.error('Error fetching property estimate:', error);
        return throwError(() => new Error(error.error?.detail || 'Failed to connect to valuation API'));
      })
    );
  }

  /**
   * Simple address validation
   */
  validateAddress(address: string): Observable<boolean> {
    // Current backend doesn't have a specific validate endpoint, 
    // so we just check length or could call a light geocode test.
    return new Observable(observer => {
      observer.next(address.length > 5);
      observer.complete();
    });
  }
}
