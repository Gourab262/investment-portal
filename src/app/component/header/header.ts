import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true
})

export class Header {
  user: any = null;

  constructor(private firebaseService: FirebaseService, private router: Router) {
    this.firebaseService.user$.subscribe(user => {
      this.user = user;
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
