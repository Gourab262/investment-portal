import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(true);
  public isOpen$ = this.isOpenSubject.asObservable();

  constructor() {
    // Check localStorage for saved state
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      try {
        const parsedState = JSON.parse(savedState);
        // Only use saved state if it's a valid boolean
        if (typeof parsedState === 'boolean') {
          this.isOpenSubject.next(parsedState);
        } else {
          // If invalid data, clear it and use default (open)
          localStorage.removeItem('sidebarOpen');
          this.isOpenSubject.next(true);
        }
      } catch (error) {
        // If parsing fails, clear localStorage and use default (open)
        localStorage.removeItem('sidebarOpen');
        this.isOpenSubject.next(true);
      }
    } else {
      // No saved state, use default (open)
      this.isOpenSubject.next(true);
      localStorage.setItem('sidebarOpen', 'true');
    }
  }

  toggle() {
    const newState = !this.isOpenSubject.value;
    this.isOpenSubject.next(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  }

  open() {
    this.isOpenSubject.next(true);
    localStorage.setItem('sidebarOpen', 'true');
  }

  close() {
    this.isOpenSubject.next(false);
    localStorage.setItem('sidebarOpen', 'false');
  }

  get isOpen(): boolean {
    return this.isOpenSubject.value;
  }
}

