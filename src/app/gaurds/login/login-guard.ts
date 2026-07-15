import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) { }

  canActivate() {
    return authState(this.auth).pipe(
      map(user => {
        if (user) {
         return this.router.createUrlTree(["/dashboard"])
        } else {
          return true;
        }
      })
    );
  }
}