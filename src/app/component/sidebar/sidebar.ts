import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  standalone: true,
  imports: [CommonModule, RouterModule] 
})
export class Sidebar {
  openSection: string | null = null;

  toggleSection(section: string) {
    this.openSection = this.openSection === section ? null : section;
  }
}
