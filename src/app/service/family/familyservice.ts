import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs
} from '@angular/fire/firestore';

export interface Member {
  id?: string;
  name: string;
  age: number;
  relation: string;
}

@Injectable({ providedIn: 'root' })
export class FamilyService {

  private firestore = inject(Firestore);

  constructor(private auth: Auth) {}

  private getUserId(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) throw new Error('User not logged in');
    return uid;
  }

  private getCollection() {
    return collection(
      this.firestore,
      `users/${this.getUserId()}/familyMembers`
    );
  }
  addMember(data: Member) {
    return addDoc(this.getCollection(), {
      name: data.name.trim(),
      age: Number(data.age),
      relation: data.relation.trim(),
      createdAt: new Date()
    });
  }
  async getMembers() {
    const snapshot = await getDocs(this.getCollection());
    
    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
  }
  updateMember(id: string, data: Member) {
    const ref = doc(
      this.firestore,
      `users/${this.getUserId()}/familyMembers/${id}`
    );
    return updateDoc(ref, {
      name: data.name.trim(),
      age: Number(data.age),
      relation: data.relation.trim(),
      updatedAt: new Date()
    });
  }
  deleteMember(id: string) {
    const ref = doc(
      this.firestore,
      `users/${this.getUserId()}/familyMembers/${id}`
    );
    return deleteDoc(ref);
  }
}