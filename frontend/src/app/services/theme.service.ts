import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'stm-theme';

  readonly themes = [
    { value: 'dark-navy', label: 'Dark Navy (Default)' },
    { value: 'midnight', label: 'Midnight' },
    { value: 'slate', label: 'Slate' },
  ];

  /** Apply theme on app boot */
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'dark-navy';
    this.applyTheme(saved);
  }

  applyTheme(theme: string) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  getCurrentTheme(): string {
    return localStorage.getItem(this.STORAGE_KEY) || 'dark-navy';
  }
}
