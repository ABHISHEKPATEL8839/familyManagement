import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService)
  private router = inject(Router)

  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  toastMessage = '';
  toastType: 'success' | 'danger' = 'success';
  showToastFlag = signal(false);
  form = this.fb.nonNullable.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

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
          Validators.required,
          Validators.minLength(6)
        
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]
    },
    {
      validators: this.passwordMatchValidator
    }
  );

  signup(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { name, email, password } = this.form.getRawValue();
    this.auth.signup(name, email, password)
      .then(() => {
        this.isLoading = false;
        this.showToast(
          'Account created successfully 🎉',
          'success'
        );
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.isLoading = false;
        if (err?.code === 'auth/email-already-in-use') {
          this.showToast(
            'User already exists. Please login.',
            'danger'
          );
        } else {
          this.showToast(
            err?.message || 'Signup failed',
            'danger'
          );
        }
      });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  allowOnlyAlphabets(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^[a-zA-Z ]$/.test(key)) {
      event.preventDefault();
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }

  showToast(
    message: string,
    type: 'success' | 'danger'
  ): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastFlag.set(true);
    setTimeout(() => {
      this.showToastFlag.set(false);
    }, 3000);
  }
}