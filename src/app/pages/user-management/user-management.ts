import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  userType: 'Admin' | 'User' | 'Manager';
}

@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagement implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    try {
      this.loading = true;
      this.firebaseService.getAllUsers().subscribe({
        next: (usersData) => {
          this.users = usersData || [];
          this.loading = false;
          console.log(this.users);
          
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.users = [];
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
      this.loading = false;
    }
  }

  getTotalUsers(): number {
    return this.users.length;
  }

  getActiveUsers(): number {
    // For now, return all users as active. This can be enhanced with user status
    return this.users.length;
  }

  getAdminUsers(): number {
    return this.users.filter(user => user.userType === 'Admin').length;
  }

  editUser(userId: string) {
    console.log('Edit user:', userId);
    // TODO: Implement edit user functionality
  }

  deleteUser(userId: string) {
    console.log('Delete user:', userId);
    // TODO: Implement delete user functionality
  }
}
