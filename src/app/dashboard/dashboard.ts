import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Header } from '../component/header/header';
import { Sidebar } from '../component/sidebar/sidebar';
import { SidebarService } from '../services/sidebar.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar]
})
export class Dashboard implements OnInit, OnDestroy {
  user: any = null;
  loading: boolean = true;
  isSidebarOpen: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.firebaseService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user;
        this.loading = false;
        
        if (!user) {
          this.router.navigate(['/login']);
        }
      });

    this.sidebarService.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isSidebarOpen = isOpen;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

