import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private auth = inject(AuthService)
  private router = inject(Router)
  private fb = inject(FormBuilder);

  isLoading = false;
  showPassword = false;
  toastMessage = '';
  toastTypeClass = 'bg-success';
  showToastMessage = signal(false);
  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]
  });


  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password)
      .then(() => {
        this.isLoading = false;
        this.showToast(
          'Login successful 🎉',
          'success'
        );
        this.router.navigate(['/dashboard']);
      })
      .catch(() => {
        this.isLoading = false;
        this.showToast(
          'Incorrect email or password ❌',
          'danger'
        );
      });
  }

  showToast(
    message: string,
    type: 'success' | 'danger'
  ): void {
    this.toastMessage = message;
    this.toastTypeClass =
      type === 'success'
        ? 'bg-success'
        : 'bg-danger';
    this.showToastMessage.set(true);
    setTimeout(() => {
      this.showToastMessage.set(false);
    }, 4000);
  }
}