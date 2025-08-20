import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Header } from '../component/header/header';
import { Sidebar } from '../component/sidebar/sidebar';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar]
})
export class Dashboard implements OnInit {
  user: any = null;
  loading: boolean = true;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.firebaseService.user$.subscribe(user => {
      this.user = user;
      this.loading = false;
      
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
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

