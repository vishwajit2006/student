import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  searchTerm = '';

  private destroy$ = new Subject<void>();
  private searchInput$ = new Subject<string>();

  constructor(private authService: AuthService, private searchService: SearchService) {}

  ngOnInit() {
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUser = user;
    });

    // Debounce so we don't fire on every single keystroke
    this.searchInput$.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => this.searchService.setTerm(term));

    // Keep local search term in sync when cleared from another component
    this.searchService.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe(term => {
      if (term === '') this.searchTerm = '';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(term: string) {
    this.searchInput$.next(term);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchService.clearTerm();
  }
}
