import { Injectable } from '@angular/core';
import {
Auth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from '@angular/fire/auth';

import{
Firestore,
collection,
addDoc
} from '@angular/fire/firestore';

@Injectable({
providedIn:'root'
})

export class DepartmentService {
getUsers() {
  throw new Error('Method not implemented.');
}

constructor(
private auth:Auth,
private firestore:Firestore
){}

register(data:any){

return createUserWithEmailAndPassword(
this.auth,
data.email,
data.password
).then(res=>{

const usersRef=collection(this.firestore,'users');

return addDoc(usersRef,{
uid:res.user.uid,
name:data.name,
email:data.email,
category:data.category,
phone:data.phone,
address:data.address,
website:data.website
});

});

}

login(email:string,password:string){

return signInWithEmailAndPassword(
this.auth,
email,
password
);

}

}