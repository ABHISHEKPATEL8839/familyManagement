
import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login';
import { SignupComponent } from './component/signup/signup';
import { DashboardComponent } from './component/dasboard/dasboard';
import { authGuard } from './gaurds/auth/auth-guard';
import { LoginGuard } from './gaurds/login/login-guard';
import { Department } from './component/department/department';
import { AllDepartment } from './component/alldepartment/alldepartment';
import { UserDetailComponent } from './component/user-detail-component/user-detail-component';

export const routes: Routes = [
  { path: '', redirectTo: "/login", pathMatch: "full", },
  { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoginGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'department',
    component: Department,
    canActivate: [authGuard]


  },
  {
    path: 'AllDepartment',
    component: AllDepartment,
    canActivate: [authGuard]
  },
  
  { path: 'user/:id', component: UserDetailComponent }
];

