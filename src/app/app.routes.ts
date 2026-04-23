import { Routes } from '@angular/router';
import { PropertySearchComponent } from './components/property-search/property-search.component';
import { PropertyDetailComponent } from './components/property-detail/property-detail.component';

export const routes: Routes = [
  { path: '', component: PropertySearchComponent },
  { path: 'property/:id', component: PropertyDetailComponent }
];
