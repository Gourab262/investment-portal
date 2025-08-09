import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-add',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './transaction-add.html',
  styleUrl: './transaction-add.scss'
})
export class TransactionAdd implements OnInit {


    transactionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute
  ) {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.firebaseService.getTransactionById(transactionId).then(transaction => {
        console.log('Transaction data:', transaction);
        
        this.transactionForm.patchValue(transaction);
      });
    }
  }

  ngOnInit(): void {
        this.transactionForm = this.fb.group({
      isin: ['', Validators.required],
      securityName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      wap: ['', Validators.required],
      brokerage: ['', Validators.required],
      totalValue: ['', Validators.required],
      netQuantity: ['', Validators.required],
      netObligation: ['', Validators.required],
    });
  }


    onSubmit() {
    if (this.transactionForm.valid) {
      const formData = this.transactionForm.value;
      this.firebaseService.addTransaction(formData)
        .then(() => {
          alert('Transaction added successfully!');
          this.transactionForm.reset();
        })
        .catch(error => {
          console.error('Error adding transaction: ', error);
        });
    }
  }
}
