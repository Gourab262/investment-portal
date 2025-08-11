import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FirebaseService } from '../../../services/firebase.service';

type InvestmentKey = 'bankSavings' | 'potd' | 'nsc' | 'fd' | 'ppf' | 'rd' | 'debtMF' | 'fmp' | 'bonds';

interface Transaction {
  wap: number;
  quantity: number;
  totalValue: number;
}

@Component({
  selector: 'app-portfolio-list',
  imports: [CommonModule],
  templateUrl: './portfolio-list.html',
  styleUrl: './portfolio-list.scss'
})
export class PortfolioList implements OnInit {
 investmentRates: Record<InvestmentKey, number> = {
    bankSavings: 5.0,
    potd: 6.7,
    nsc: 6.8,
    fd: 7.0,
    ppf: 7.1,
    rd: 7.5,
    debtMF: 8.0,
    fmp: 8.0,
    bonds: 9.0
  };

  alternatives: Record<InvestmentKey, number> = {
    bankSavings: 0,
    potd: 0,
    nsc: 0,
    fd: 0,
    ppf: 0,
    rd: 0,
    debtMF: 0,
    fmp: 0,
    bonds: 0
  };

  amountInvested = 0;
  currentValue = 0;
  profitLoss = 0;
  totalReturnPercent = 0;

  constructor(private firebaseService: FirebaseService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.firebaseService.getAllTransactions().subscribe({
      next: (transactions: Transaction[]) => {
        this.calculatePortfolioValues(transactions);
        this.calculateReturns();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  calculatePortfolioValues(transactions: Transaction[]) {
    this.amountInvested = transactions.reduce((sum, t) => sum + (t.wap * t.quantity), 0);
    this.currentValue = transactions.reduce((sum, t) => sum + t.totalValue, 0);
    
  }

  calculateReturns() {
    this.profitLoss = this.currentValue - this.amountInvested;
    this.totalReturnPercent = (this.profitLoss / this.amountInvested) * 100;

    (Object.keys(this.investmentRates) as InvestmentKey[]).forEach(key => {
      this.alternatives[key] = this.amountInvested * (1 + (this.investmentRates[key] / 100));
    });
  }

  // Safe type conversion for template
  getInvestmentName(key: string): string {
    const names: Record<string, string> = {
      bankSavings: 'Bank Savings',
      potd: 'Post Office TD',
      nsc: 'National Savings Cert',
      fd: 'Fixed Deposit',
      ppf: 'Public Provident Fund',
      rd: 'Recurring Deposit',
      debtMF: 'Debt Mutual Funds',
      fmp: 'Fixed Maturity Plans',
      bonds: 'Bonds'
    };
    return names[key] || key;
  }

  // Helper to safely access investment rates
  getInvestmentRate(key: string): number {
    return this.investmentRates[key as InvestmentKey] || 0;
  }
}



