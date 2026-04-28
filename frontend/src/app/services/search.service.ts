import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');

  /** Observable that any component can subscribe to */
  searchTerm$ = this.searchTerm.asObservable();

  setTerm(term: string) {
    this.searchTerm.next(term.trim());
  }

  clearTerm() {
    this.searchTerm.next('');
  }
}
