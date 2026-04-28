import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  // Display name
  displayName = '';
  editName = '';

  // UI state
  isEditingName = false;
  saveMessage: string | null = null;
  saveError = false;

  // Theme preference
  selectedTheme = 'dark-navy';

  get themes() { return this.themeService.themes; }

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.displayName = user.email.split('@')[0];
        this.editName = this.displayName;
      }
    });
    // Load persisted theme
    this.selectedTheme = this.themeService.getCurrentTheme();
  }

  get avatarLetter(): string {
    return this.currentUser?.email.charAt(0).toUpperCase() ?? '?';
  }

  saveName() {
    this.isEditingName = false;
    this.displayName = this.editName;
    this.showSave('Display name updated');
  }

  onThemeChange() {
    // Apply immediately on selection change so the user sees it live
    this.themeService.applyTheme(this.selectedTheme);
  }

  savePreferences() {
    this.themeService.applyTheme(this.selectedTheme);
    this.showSave('Preferences saved');
  }

  showSave(msg: string, isError = false) {
    this.saveMessage = msg;
    this.saveError = isError;
    setTimeout(() => { this.saveMessage = null; }, 3000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
