import { ChangeDetectorRef, Component, inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
  imports: [CommonModule]
})

export class Header implements OnInit, OnDestroy {
  user: any = null;
  isMenuOpen: boolean = false;
  isSidebarOpen: boolean = true;
  private firebaseService = inject(FirebaseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private sidebarService = inject(SidebarService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.firebaseService.user$.subscribe(user => {
      this.user = user;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    this.sidebarService.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isSidebarOpen = isOpen;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getUserDisplayName(): string {
    if (!this.user) return '';
    
    // Try to get display name from user object
    if (this.user.displayName) {
      return this.user.displayName;
    }
    
    // Fallback to email username
    if (this.user.email) {
      return this.user.email.split('@')[0];
    }
    
    return 'User';
  }

  getUserAvatar(): string {
    if (!this.user) return '';
    
    // Try to get photo URL from user object
    if (this.user.photoURL) {
      return this.user.photoURL;
    }
    
    // Fallback to generated avatar
    const name = this.getUserDisplayName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&rounded=true&size=80`;
  }

  openProfile(): void {
    // TODO: Implement profile page navigation
    console.log('Open profile clicked');
    this.isMenuOpen = false;
  }

  openSettings(): void {
    // TODO: Implement settings page navigation
    console.log('Open settings clicked');
    this.isMenuOpen = false;
  }

  async signOut() {
    try {
      await this.firebaseService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
