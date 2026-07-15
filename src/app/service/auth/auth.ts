import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;
  constructor(private auth: Auth, private afAuth: Firestore) {
    this.user$ = authState(this.auth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  logout() {
    return signOut(this.auth);
  }
  getUser() {
    return this.auth.currentUser;
  }
  getUID(): string | null {
    return this.auth.currentUser?.uid || null;
  }
  saveUserProfile(user: any, name: string) {
    const uid = user.uid;
    const emailName = user.email?.split('@')[0] || '';
    return setDoc(doc(this.afAuth, `users/${uid}`), {
      uid: uid,
      email: user.email,
      name: name,
      createdAt: new Date()
    });
  }
  async signup(name: string, email: string, password: string) {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await this.saveUserProfile(result.user, name);
    return result;
  }

}








