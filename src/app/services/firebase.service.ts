import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User as FirebaseUser } from '@angular/fire/auth';





@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  user$: Observable<FirebaseUser | null>;


  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {
    this.user$ = user(this.auth);
  }

  // Authentication methods
  async signIn(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }



  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

   getAllTransactions(): Observable<any[]> {
    const transactionRef = collection(this.firestore, 'transaction-list');
    return collectionData(transactionRef, { idField: 'id' }) as Observable<any[]>;
  }

  getTransactionById(id: string) {
    const docRef = doc(this.firestore, `transaction-list/${id}`);
    return getDoc(docRef);
  }

  addTransaction(data: any) {
    const transactionRef = collection(this.firestore, 'transaction-list');
    return addDoc(transactionRef, data);
  }

  updateTransaction(id: string, data: any) {
    const docRef = doc(this.firestore, `transaction-list/${id}`);
    return updateDoc(docRef, data);
  }

  deleteTransaction(id: string) {
    const docRef = doc(this.firestore, `transaction-list/${id}`);
    return deleteDoc(docRef);
  }

}
