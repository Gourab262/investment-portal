import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './transaction-add.html',
  styleUrl: './transaction-add.scss'
})
export class TransactionAdd implements OnInit {

  transactionForm!: FormGroup;
  transactionId: any;
  transactionData: any = {};
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transactionId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.initializeForm();
    
    if (this.transactionId) {
      this.loadTransactionForEdit();
    }
  }

  initializeForm(): void {
    this.transactionForm = this.fb.group({
      isin: ['', [Validators.required, Validators.pattern(/^[A-Z0-9a-z]{12}$/)]],
      securityName: ['', [Validators.required, Validators.minLength(2)]],
      symbol: ['', [Validators.required, Validators.minLength(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      wap: ['', [Validators.required, Validators.min(0.0001)]],
      brokerage: ['', [Validators.required, Validators.min(0)]],
      totalValue: [{value: '', disabled: true}, Validators.required],
      netQuantity: [{value: '', disabled: true}, Validators.required],
      netObligation: [{value: '', disabled: true}, Validators.required],
    });

    // Set up value changes for auto-calculation
    this.transactionForm.get('quantity')?.valueChanges.subscribe(() => this.calculateValues());
    this.transactionForm.get('wap')?.valueChanges.subscribe(() => this.calculateValues());
    this.transactionForm.get('brokerage')?.valueChanges.subscribe(() => this.calculateValues());
  }

  loadTransactionForEdit(): void {
    this.firebaseService.getTransactionById(this.transactionId).then((transaction: any) => {
      if (transaction) {
        this.transactionForm.patchValue(transaction);
        this.calculateValues();
      }
    }).catch(error => {
      console.error('Error loading transaction:', error);
    });
  }

  onSymbolInput(event: any): void {
    const value = event.target.value;
    this.transactionForm.patchValue({
      symbol: value.toUpperCase()
    });
  }

  calculateValues(): void {
    const quantity = parseFloat(this.transactionForm.get('quantity')?.value) || 0;
    const wap = parseFloat(this.transactionForm.get('wap')?.value) || 0;
    const brokerage = parseFloat(this.transactionForm.get('brokerage')?.value) || 0;

    // Calculate Total Buy/Sell Value: (WAP + Brokerage) × Quantity
    const totalValue = (wap + brokerage) * quantity;

    // For now, set Net Quantity and Net Obligation same as current values
    // In a real application, these would be calculated based on existing transactions
    const netQuantity = quantity;
    const netObligation = totalValue;

    this.transactionForm.patchValue({
      totalValue: totalValue.toFixed(4),
      netQuantity: netQuantity,
      netObligation: netObligation.toFixed(4)
    });
  }

  resetForm(): void {
    this.transactionForm.reset();
    this.calculateValues();
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.isSubmitting = true;
      
      // Get the form values and enable disabled controls to get their values
      const formData = this.transactionForm.getRawValue();
      
      // Ensure all numeric values are properly formatted
      const transactionData = {
        isin: formData.isin,
        securityName: formData.securityName,
        symbol: formData.symbol,
        quantity: parseFloat(formData.quantity),
        wap: parseFloat(formData.wap),
        brokerage: parseFloat(formData.brokerage),
        totalValue: parseFloat(formData.totalValue),
        netQuantity: parseFloat(formData.netQuantity),
        netObligation: parseFloat(formData.netObligation),
        createdAt: new Date().toISOString()
      };

      if (this.transactionId) {
        // Update existing transaction
        this.firebaseService.updateTransaction(this.transactionId, transactionData)
          .then(() => {
            this.showSuccessMessage('Transaction updated successfully!');
            this.router.navigate(['/dashboard/transaction-list']);
          })
          .catch(error => {
            this.showErrorMessage('Error updating transaction');
            console.error('Error updating transaction:', error);
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      } else {
        // Add new transaction
        this.firebaseService.addTransaction(transactionData)
          .then(() => {
            this.showSuccessMessage('Transaction added successfully!');
            this.resetForm();
          })
          .catch(error => {
            this.showErrorMessage('Error adding transaction');
            console.error('Error adding transaction:', error);
          })
          .finally(() => {
            this.isSubmitting = false;
          });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }

  showSuccessMessage(message: string): void {
    // You can implement a proper toast/notification system here
    alert(message);
  }

  showErrorMessage(message: string): void {
    // You can implement a proper toast/notification system here
    alert(message);
  }

  // Helper methods for template
  getFieldError(fieldName: string): string {
    const field = this.transactionForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field?.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field?.errors?.['pattern']) {
        return `${this.getFieldLabel(fieldName)} format is invalid`;
      }
      if (field?.errors?.['min']) {
        return `${this.getFieldLabel(fieldName)} must be greater than ${field.errors['min'].min}`;
      }
      if (field?.errors?.['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      isin: 'ISIN',
      securityName: 'Security Name',
      symbol: 'Symbol',
      quantity: 'Quantity',
      wap: 'WAP',
      brokerage: 'Brokerage',
      totalValue: 'Total Value',
      netQuantity: 'Net Quantity',
      netObligation: 'Net Obligation'
    };
    return labels[fieldName] || fieldName;
  }
}
