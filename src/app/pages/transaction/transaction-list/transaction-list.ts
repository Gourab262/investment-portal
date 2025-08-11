import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
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
    private firebaseService: FirebaseService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.firebaseService.getAllTransactions().subscribe((data: any[]) => {
      this.transactions = data.map(doc => ({ id: doc.id, ...doc }));
      if (this.transactions.length > 0) {
        this.tableColumns = Object.keys(this.transactions[0]).filter(k => k !== 'id');
      }
      this.cdr.detectChanges();
    });
  }

  deleteTransaction(id: string) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.firebaseService.deleteTransaction(id).then(() => {
        this.getTransactions();
      });
    }
  }

  editTransaction(id: string) {
    this.router.navigate(['/dashboard/edit-transaction', id]);
  }
}
