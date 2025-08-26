import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss'
})
export class TransactionList implements OnInit {
  transactions: any[] = [];
  tableColumns: string[] = [];

  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Methods removed to prevent compilation errors
  }
}
