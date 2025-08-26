import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc, getDocs, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User as FirebaseUser } from '@angular/fire/auth';





@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  user$: Observable<FirebaseUser | null>;


  constructor(
    private auth: Auth,
    private firestore: Firestore
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

  // User collection methods
  getAllUsers(): Observable<any[]> {
    const userRef = collection(this.firestore, 'user');
    return collectionData(userRef, { idField: 'id' }) as Observable<any[]>;
  }

  async getUserById(id: string) {
    const docRef = doc(this.firestore, `user/${id}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  }

}
