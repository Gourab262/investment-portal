import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-list',
  imports: [],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.scss'
})
export class TransactionList implements OnInit {
  transactions: any[] = [];
  tableColumns: string[] = [];

  constructor(
    private firebaseService: FirebaseService,
    public router: Router
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
    this.router.navigate(['/edit-transaction', id]);
  }
}
