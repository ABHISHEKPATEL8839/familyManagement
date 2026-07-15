import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../service/department/department';
import { Router, } from '@angular/router';
declare var bootstrap: any;
@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department.html',
  styleUrls: ['./department.css']
})
export class Department {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private service = inject(DepartmentService)

  showPassword = false;
  isLoading = false;
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],

      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],

      category: ['', Validators.required],

      phone: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')]
      ],

      website: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(https?:\/\/)?localhost(:\d+)?(\/.*)?$/i)
        ]
      ],

      address: ['', Validators.required],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]
      ]
    });
  }

  categories = [
    'Faculty',
    'Staff',
    'Post Doc',
    'PHD',
    'MSC',
    'B.TECH',
    'Visitor',
    'Alumini'
  ];


  showToast() {
    const toastLive = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastLive);
    toast.show();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.service.register(this.registerForm.value)
      .then(() => {
        this.isLoading = false;

        this.showSuccessToast();

        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/AllDepartment']);
        }); // small delay so toast is visible
      })
      .catch(error => {
        this.isLoading = false;
        this.showErrorToast();
      });
  }

  showSuccessToast() {
    const toast = new bootstrap.Toast(
      document.getElementById('successToast')
    );
    toast.show();
  }

  showErrorToast() {
    const toast = new bootstrap.Toast(
      document.getElementById('errorToast')
    );
    toast.show();
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const char = String.fromCharCode(event.keyCode || event.which);

    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }

    // Block if already 10 digits
    if (value.length >= 10) {
      event.preventDefault();
    }
  }
  goToDepartments(event: Event): void {
    event.preventDefault(); // stop default anchor behavior
    this.router.navigate(['/AllDepartment']);
  }
}





