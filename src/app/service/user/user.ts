import { collection, getDocs, updateDoc } from '@angular/fire/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, docData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private firestore: Firestore, private auth: Auth) {
    this.getUserData()
  }

  getUserName() {
    return authState(this.auth)
    
  }
  async saveUser(data: any) {
    const user = this.auth.currentUser;
    if (!user) return;

    const ref = doc(this.firestore, `users/${user.uid}`);

    return setDoc(ref, {
      ...data,
      email: user.email,
      name: name
    });
  }
  createUserProfile(user: any) {
    const uid = user.uid;

    return setDoc(doc(this.firestore, `users/${uid}`), {
      name: user.name || '',
      email: user.email,
      createdAt: new Date()
    });
  }


  
  getUser() {
    return new Observable((observer: any) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  
  saveUserProfile(user: any) {
    const uid = user.uid;

    return setDoc(doc(this.firestore, `users/${uid}`), {
      uid: uid,
      email: user.email,
      name: user.displayName || '',
      createdAt: new Date()
    });
  }
  async getUserData() {
    const user = await firstValueFrom(authState(this.auth));
    if (!user) return
    const ref = doc(this.firestore, `users/${user.uid}`)
    const snapshot = await getDoc(ref)
    const data = snapshot.data()

    return data;
    
  }

    async getUserDataDepartment() {
    const user = await firstValueFrom(authState(this.auth));
    if (!user) return
    const ref = collection(this.firestore, `users`)
    const snapshot = await getDocs(ref)
    const data = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    return data;
    
  }

updateUserData(data:any) {
  return updateDoc(
    doc(this.firestore,'users',this.auth.currentUser!.uid),
    data
  );
}
  async getUserById(id: string) {
    const docRef = doc(this.firestore, `users/${id}`);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data();
    }
    throw new Error('User not found');
  }

}




